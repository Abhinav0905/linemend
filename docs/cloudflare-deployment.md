# Standalone Cloudflare deployment

This target serves the React app and its API directly from a Cloudflare Worker.
Public address: https://linemend.linemend.workers.dev

It does not call the original Sites host. D1 stores the shared model-request
counter; Nebius Token Factory remains the inference provider.

`vite.cloudflare.config.ts` and `worker/cloudflare.ts` are the standalone entry
points. The original `vite.config.ts` remains available for the older deployment.

## First deployment

1. Sign in to the intended personal Cloudflare account and authorize Wrangler:

   ```sh
   npx --yes wrangler@4.156.0 login --scopes account:read user:read workers:write workers_scripts:write d1:write
   npx --yes wrangler@4.156.0 whoami
   ```

2. Create a D1 database with `npx --yes wrangler@4.156.0 d1 create linemend-budget`.
   Set its returned ID in `wrangler.cloudflare.jsonc`. The placeholder ID must
   be replaced before deployment. Apply its migration:

   ```sh
   npx --yes wrangler@4.156.0 d1 migrations apply DB --remote --config wrangler.cloudflare.jsonc
   ```

3. Build and deploy:

   ```sh
   npm run build:cloudflare
   npx --yes wrangler@4.156.0 deploy --config dist/server/wrangler.json
   npx --yes wrangler@4.156.0 secret put NEBIUS_API_KEY --config dist/server/wrangler.json
   ```

   Enter the key only at the hidden secret prompt. The model name is a nonsecret
   variable in the Wrangler configuration. Never put the API key in that file,
   the client bundle or Git.

4. Verify anonymous access to `/`, `/api/status` and a real `/api/interpret`
   request. In the browser, review the two breakdown constraints and confirm
   the 8/8 result. Update the demo and Devpost links only after verification.

When moving an existing deployment, preserve its aggregate request counts and
retire its inference endpoint after the new app works. Otherwise two separate
counters would allow twice the intended model-request budget.

## Local production preview

```sh
npm run build:cloudflare
npx --yes wrangler@4.156.0 d1 migrations apply DB --local --config wrangler.cloudflare.jsonc --persist-to .wrangler/cloudflare-local
npx --yes wrangler@4.156.0 dev --config dist/server/wrangler.json --local --persist-to .wrangler/cloudflare-local --port 5174
```

The preview reads the ignored `.dev.vars` file. The pinned build integration
emits a retired `legacy_env` configuration field; the build finalizer removes
that field for Wrangler 4.156.0. No application behavior changes in that step.
