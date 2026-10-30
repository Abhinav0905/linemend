# LineMend handoff

Updated October 29, 2026 Pacific. Deadline: October 30 at 10:00 a.m. Pacific.

## Verified now

- Public app: https://linemend.linemend.workers.dev
- Public source: https://github.com/Abhinav0905/linemend
- Published project page: https://devpost.com/software/linemend. The hackathon entry has no submitted timestamp and is not submitted.
- 22 automated tests pass, including 60 generated disruption cases and shared quota checks. Type checking and production build pass.
- Five live checks passed using NVIDIA Nemotron 3 Super on Nebius Token Factory: three exact extractions and two appropriate clarifications.
- Anonymous Cloudflare HTTPS root, status and real interpretation calls passed for the breakdown and urgent-order cases. Safari confirmed the live 8/8 recovery and 5/8 old-queue comparison. See `artifacts/cloudflare-live-check.json`.
- The UI now follows the user's requested sequence: problem, approach, working details, result. Safari checks verified real AI extraction, review, automatic scrolling to the calculated result and the 8/8 versus 5/8 comparison. The problem layout was inspected at a narrow responsive breakpoint using browser zoom, then normal zoom was restored.
- Runtime key is stored as a Cloudflare Worker secret. Local key and personal-answer files are ignored and mode 0600. No key is in Git or the client bundle.

## Remaining

1. The user chose to record the video personally. Do not use Playwright to record. The updated 2:40 guide is in `docs/demo-script.md`. Receive the local video path or public YouTube URL, verify playback and duration, and finish the video field.
2. Residence, adult age, learning level and career value were confirmed. Exact answers are in ignored `.devpost-local-answers.json`; do not copy them to public source. The final affiliation checkbox must cover all promotion entities, representatives, agents and affiliates.
3. Obtain the official rules/eligibility agreement, then perform the final submission and verify its submitted timestamp. Do not confuse the published project page with a submitted hackathon entry.

The official $25 credit request succeeded, but its email code is still pending. The account already supports the verified inference calls. Shared D1 limits this app to 100 model calls per UTC day and 300 total. Failed calls count; deploys do not reset the total. This is a request cap, not an account-wide financial limit.

## Hosting and service IDs

Active host: standalone Cloudflare Workers at https://linemend.linemend.workers.dev

Worker: `linemend`. D1 database: `linemend-budget`, ID `d165317e-458b-4872-ba0f-6d3c88621fef`.

Cloudflare deployment: `73fbe987-52fa-4ca4-9c1a-0b9a17fbdf5a`.
Version: `23db263c-6ced-4980-846c-a50aae6efb55` (100% traffic).

Build: `npm run build:cloudflare`. Deployment instructions: `docs/cloudflare-deployment.md`.

The old address, https://linemend-workshop.abhinav-0905.chatgpt.site, now returns a 307 redirect for GET/HEAD. Its write endpoint returns 410. The old hosted Nebius secret was removed, and its two model calls were added to the new D1 counter. After the three new-host checks, the preserved total was five. No workshop notes were migrated.

Retired Site: `appgprj_6ae2fae3cb108191970e9c3f387ac6e3`.
Redirect deployment: `appgdep_6ae3f68237fc8191b0b2946c3272d7c0`.
Redirect source: `285e56e0df1f21f3c5914aac58b86dfc38b06845`; environment revision 2.

Devpost project: 1515854; entry: 1270295. The project description and links were updated to Cloudflare in version 5. No video or submitted timestamp exists yet.

Active development and public GitHub source are in `linemend/`. The separate `linemend-site/` checkout is retained for the old-address redirect. Preserve the two Git histories. Do not restore inference on the old host without reassessing the shared request cap.

No customer adoption, measured workshop savings or winning probability is claimed. See `docs/live-verification.md` for the actual model failures and fixes.
