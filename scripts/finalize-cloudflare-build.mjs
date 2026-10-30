import { readFileSync, writeFileSync } from "node:fs";

// The pinned Vite integration emits this retired field. Current Wrangler uses
// the same environment behavior without it.
const file = new URL("../dist/server/wrangler.json", import.meta.url);
const config = JSON.parse(readFileSync(file, "utf8"));
delete config.legacy_env;
writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`);
