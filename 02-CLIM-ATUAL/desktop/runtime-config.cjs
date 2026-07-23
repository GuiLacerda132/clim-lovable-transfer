const { readFileSync } = require("node:fs");
const { dirname, join } = require("node:path");

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function requireValue(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error("A configuração da CLIM está incompleta.");
  }

  return value;
}

function decodeXml(value) {
  return value.replace(/&(amp|lt|gt|quot|apos);/g, (_match, entity) => {
    const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
    return entities[entity];
  });
}

function readXmlValue(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, "i"));
  return match ? decodeXml(match[1].trim()) : "";
}

function createDesktopRuntimeConfig({ databaseHost, databaseName, username, password }) {
  const host = requireValue(databaseHost);
  const name = requireValue(databaseName);
  const user = requireValue(username);
  const secret = requireValue(password);
  const databaseUrl = new URL("postgresql://localhost");

  databaseUrl.username = user;
  databaseUrl.password = secret;
  databaseUrl.hostname = host;
  databaseUrl.port = "5432";
  databaseUrl.pathname = `/${name}`;

  return Object.freeze({
    appUrl: "http://127.0.0.1:4310",
    databaseUrl: databaseUrl.toString(),
  });
}

function loadLegacyRuntimeConfig(configPath) {
  const xml = readFileSync(configPath, "utf8");

  return createDesktopRuntimeConfig({
    databaseHost: readXmlValue(xml, "server"),
    databaseName: readXmlValue(xml, "database"),
    username: readXmlValue(xml, "user"),
    password: readXmlValue(xml, "password"),
  });
}

function findLegacyConfigPath(roots, fileExists) {
  for (const root of roots) {
    if (!root) {
      continue;
    }

    let currentFolder = root;
    for (let level = 0; level < 6; level += 1) {
      const candidate = join(currentFolder, "laboratorio-sigclin", "legacy-root", "config.xml");
      if (fileExists(candidate)) {
        return candidate;
      }

      const parentFolder = dirname(currentFolder);
      if (parentFolder === currentFolder) {
        break;
      }
      currentFolder = parentFolder;
    }
  }

  throw new Error("Não encontrei a configuração local da CLIM.");
}

function resolveApplicationServerFile({ packaged, projectRoot, resourcesPath }) {
  if (packaged) {
    return join(resourcesPath, "app.asar.unpacked", ".output", "server", "index.mjs");
  }

  return join(projectRoot, ".output", "server", "index.mjs");
}

function isLocalApplicationUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" && LOCAL_HOSTS.has(url.hostname) && url.port === "4310";
  } catch {
    return false;
  }
}

module.exports = {
  createDesktopRuntimeConfig,
  findLegacyConfigPath,
  isLocalApplicationUrl,
  loadLegacyRuntimeConfig,
  resolveApplicationServerFile,
};
