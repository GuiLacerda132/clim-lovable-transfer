const { existsSync } = require("node:fs");
const { get } = require("node:http");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { app, BrowserWindow, dialog } = require("electron");
const {
  findLegacyConfigPath,
  isLocalApplicationUrl,
  loadLegacyRuntimeConfig,
  resolveApplicationServerFile,
} = require("./runtime-config.cjs");

const projectRoot = path.resolve(__dirname, "..");
const serverFile = resolveApplicationServerFile({
  packaged: app.isPackaged,
  projectRoot,
  resourcesPath: process.resourcesPath,
});

function resolveLegacyConfig() {
  const configOverride = process.env.CLIM_SIGCLIN_CONFIG;
  if (configOverride && existsSync(configOverride)) {
    return configOverride;
  }

  return findLegacyConfigPath(
    [process.env.PORTABLE_EXECUTABLE_DIR, path.dirname(process.execPath), projectRoot],
    existsSync,
  );
}

function waitForServer(appUrl, remainingAttempts = 40) {
  return new Promise((resolve, reject) => {
    const request = get(appUrl, (response) => {
      response.resume();
      resolve();
    });

    request.on("error", () => {
      if (remainingAttempts <= 0) {
        reject(new Error("Não foi possível iniciar o servidor local da CLIM."));
        return;
      }

      setTimeout(() => resolve(waitForServer(appUrl, remainingAttempts - 1)), 250);
    });

    request.setTimeout(1000, () => request.destroy());
  });
}

function startApplicationServer() {
  if (!existsSync(serverFile)) {
    throw new Error("A interface CLIM ainda não foi preparada. Execute a instalação novamente.");
  }

  const runtime = loadLegacyRuntimeConfig(resolveLegacyConfig());
  process.env.NITRO_HOST = "127.0.0.1";
  process.env.NITRO_PORT = "4310";
  process.env.SIGCLIN_DATABASE_SSL = "false";
  process.env.SIGCLIN_DATABASE_URL = runtime.databaseUrl;

  return runtime;
}

async function createMainWindow(runtime) {
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1000,
    minHeight: 720,
    autoHideMenuBar: true,
    title: "CLIM",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", (event, url) => {
    if (!isLocalApplicationUrl(url)) {
      event.preventDefault();
    }
  });

  await window.loadURL(runtime.appUrl);
}

app.whenReady().then(async () => {
  try {
    const runtime = startApplicationServer();
    await import(pathToFileURL(serverFile).href);
    await waitForServer(runtime.appUrl);
    await createMainWindow(runtime);
  } catch (error) {
    dialog.showErrorBox("CLIM", error instanceof Error ? error.message : "Erro ao abrir a CLIM.");
    app.quit();
  }
});

app.on("window-all-closed", () => app.quit());
