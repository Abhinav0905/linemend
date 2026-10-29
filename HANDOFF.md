# LineMend handoff

Updated October 29, 2026. Deadline: October 30 at 10:00 a.m. Pacific.

## Verified

- Private app: https://linemend-workshop.abhinav-0905.chatgpt.site
- Public source: https://github.com/Abhinav0905/linemend
- Devpost draft: https://devpost.com/software/linemend
- 21 tests pass, including 60 generated disruption cases and shared quota checks. Type check and production build pass.
- Safari checks passed for all three examples, comparisons, what-if control, valid/invalid imports, CSV/JSON exports, modal keyboard dismissal and responsive layouts. See `artifacts/browser-qa.json`.
- Shared D1 quota: 100 model calls per UTC day and 300 calls total. A reservation precedes each provider call. Failed calls count. Missing storage stops inference. This does not cap other apps or direct account usage.
- Latest private deployment succeeded: `appgdep_6ae36bfc66348191bacf7967dd812ada`.
- Saved version: `appgprj_6ae2fae3cb108191970e9c3f387ac6e3~appgver_4655f2a2632c8191ae6b68c6c322c1e7`.
- Deployed source: `c4ab9d38ecdb329faeeea6189a9b932c89ccf752`.

## Current account state

The user completed Nebius billing and created a key named `hackathon`. A value captured from the one-time dialog failed authentication and did not match the listed ending. The user has been asked to paste the complete copied key into a local password form in Safari. It writes only ignored `.dev.vars` files with mode 0600 and stops after saving. No key is in Git or the hosted Site yet.

The official $25 hackathon credit request was submitted successfully. The email code is still pending. Activation code: `NEBIUS-DEVPOST-GLOBAL26`.

## Remaining work

1. Verify the complete key with the Nebius model catalog. Do not display it. Run `node --env-file=.dev.vars --experimental-strip-types scripts/live-check.ts` and inspect every extraction and schedule.
2. Set the hosted `NEBIUS_API_KEY` as a secret and redeploy the saved version to apply the environment revision. Verify real hosted inference and the D1 counter path.
3. The user explicitly approved public demo access after live checks pass. Change the Site audience to public, then verify anonymous access.
4. The user chose to record the video personally. Do not use Playwright: permission for that fallback was not given. `docs/demo-script.md` gives a 2:20 recording guide. Verify the final public YouTube link before submitting.
5. Update the Devpost story with actual model evidence and public links. Collect residence, eligibility attestations and subjective feedback without inventing answers.
6. Confirm rule/eligibility agreement, submit and verify `Submitted` with a timestamp. The entry is currently Draft, not submitted.

## Service and source state

Site ID: `appgprj_6ae2fae3cb108191970e9c3f387ac6e3`.
Devpost project ID: `1515854`; submission ID: `1270295`.

The original public repository is `linemend/`. The existing Sites source was opened separately in `linemend-site/` to preserve its original history. Current implementation edits were made there and copied into the public checkout. Use the Sites helper with that checkout for later Site updates, and keep the public GitHub checkout synchronized. Do not create another Site. Runtime secret files are ignored in both checkouts.

No customer adoption, measured workshop savings or winning probability is claimed.
