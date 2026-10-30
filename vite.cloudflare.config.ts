import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

// Standalone hosting. No Sites authentication, connector or deployment service.
export default defineConfig({
  plugins: [
    vinext(),
    cloudflare({
      configPath: "wrangler.cloudflare.jsonc",
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
      inspectorPort: false,
    }),
  ],
});
