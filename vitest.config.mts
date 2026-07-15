import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config"

export default defineWorkersConfig({
  test: {
    // `vendor/brave-search-mcp-server` is a git submodule with its own test
    // suite that runs on Node's built-in `node:test` runner (see its
    // `package.json`). It is not compatible with the Workers vitest pool,
    // so it must be excluded here.
    exclude: ["**/node_modules/**", "vendor/**"],
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.jsonc" },
      },
    },
  },
})
