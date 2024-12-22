import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import wasm from "vite-plugin-wasm"
import topLevelAwait from "vite-plugin-top-level-await"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    wasm(),
    topLevelAwait(),
    tsconfigPaths(),
  ],
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
    exclude: ["@journeyapps/wa-sqlite", "@powersync/web"],
    include: ["@powersync/web > js-logger"],
  },

  worker: {
    format: "es",
    plugins: () => [wasm(), topLevelAwait()],
  },
})
