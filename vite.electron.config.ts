import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Electron build: run Nitro with Node preset so the packaged app runs offline
// with an in-process local server, then a BrowserWindow loads it.
// NOTE: This config is only effective outside the Lovable sandbox (locally),
// because the sandbox forces the Cloudflare preset.
export default defineConfig({
  tanstackStart: { server: { entry: "server" } },
  nitro: {
    preset: "node-server",
    output: {
      dir: "dist-electron",
      serverDir: "dist-electron/server",
      publicDir: "dist-electron/client",
    },
  },
});
