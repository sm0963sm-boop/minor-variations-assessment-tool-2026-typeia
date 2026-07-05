import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: { server: { entry: "server" } },
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ["/", "/catalog", "/classify", "/classify-multi", "/guidance"],
    },
  },
  vite: { base: "./" },
});
