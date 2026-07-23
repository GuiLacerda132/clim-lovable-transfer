import { describe, expect, it } from "vitest";
import {
  createDesktopRuntimeConfig,
  findLegacyConfigPath,
  isLocalApplicationUrl,
  resolveApplicationServerFile,
} from "../../desktop/runtime-config.cjs";

describe("desktop runtime configuration", () => {
  it("keeps the database URL in the main process configuration", () => {
    const config = createDesktopRuntimeConfig({
      databaseHost: "127.0.0.1",
      databaseName: "sigclin",
      username: "local-user",
      password: "password with @ sign",
    });

    expect(config.databaseUrl).toBe(
      "postgresql://local-user:password%20with%20%40%20sign@127.0.0.1:5432/sigclin",
    );
  });

  it("only permits the embedded window to navigate to the local application", () => {
    expect(isLocalApplicationUrl("http://127.0.0.1:4310/agenda")).toBe(true);
    expect(isLocalApplicationUrl("https://example.com")).toBe(false);
  });

  it("rejects incomplete legacy database settings", () => {
    expect(() =>
      createDesktopRuntimeConfig({
        databaseHost: "127.0.0.1",
        databaseName: "sigclin",
        username: "",
        password: "local-password",
      }),
    ).toThrow("configuração da CLIM");
  });

  it("finds the legacy configuration outside the packaged executable folder", () => {
    const executableFolder = "C:\\Users\\guilh\\Desktop\\SISTEMA CLIM\\clim-web\\release";
    const expected =
      "C:\\Users\\guilh\\Desktop\\SISTEMA CLIM\\laboratorio-sigclin\\legacy-root\\config.xml";

    expect(findLegacyConfigPath([executableFolder], (candidate) => candidate === expected)).toBe(
      expected,
    );
  });

  it("uses the unpacked server when running from the Windows executable", () => {
    expect(
      resolveApplicationServerFile({
        packaged: true,
        projectRoot: "C:\\project",
        resourcesPath: "C:\\release\\resources",
      }),
    ).toBe("C:\\release\\resources\\app.asar.unpacked\\.output\\server\\index.mjs");
  });
});
