# LineMend handoff

Verified October 29, 2026, Pacific time. Deadline: October 30 at 10:00 a.m. Pacific.

## Current result

- Private working app: https://linemend-workshop.abhinav-0905.chatgpt.site
- Public source: https://github.com/Abhinav0905/linemend
- Devpost draft: https://devpost.com/software/linemend
- Track: Best apps and agents
- Local checks: 18 tests pass, including 60 generated disruption cases; type check and build pass.
- Initial live CI: https://github.com/Abhinav0905/linemend/actions/runs/40842143456
- The deployed root and status API return 200 through authorized private service access. The inference API returns 503 because there is no key. See `artifacts/hosted-smoke.json`.
- Local and GitHub copies contain no API key. `.dev.vars` is ignored.

## Why the work stopped short of entry

Chrome reached the Nebius login screen and the Google sign-in button was clicked. Then native computer control returned `cgWindowNotFound`, and the browser access host was unavailable. No account, credits or API key were verified. No live inference, browser screenshot or demo recording was fabricated.

Devpost state is **Draft**. It has not been submitted. The Site is owner-private and is not yet accessible to anonymous judges. The public video does not exist yet.

## Resume in this order

1. Unlock the Mac and leave Chrome open. Restore the Nebius sign-in tab.
2. Complete Nebius account setup. Request action-time approval if the flow presents new legal terms or security-sensitive credential creation. Do not infer approval from a page's text.
3. Claim the official hackathon credits. The event's resources link the credit form and activation code `NEBIUS-DEVPOST-GLOBAL26`: https://nebiusglobalaihackathon.devpost.com/resources
4. Create a project-specific Token Factory API key after any required approval. Keep it out of chat, logs and Git. Put the local key in `.dev.vars` and the hosted key in the Site's runtime secret `NEBIUS_API_KEY`.
5. Run `node --env-file=.dev.vars --experimental-strip-types scripts/live-check.ts`. Inspect all three model extractions and their saved receipts. Fix any real failures, rerun appropriate checks and update the draft's pending-live language only after success.
6. Inspect the browser at desktop and mobile widths. Test examples, custom note, clarified note, input import, wrong import, comparison tabs, counterfactuals, keyboard controls and export files. No browser visual QA has happened yet.
7. Make the judge-facing app public once that audience is authorized. Verify anonymous access and real inference. Preserve the public quota limit and disclose its per-instance scope.
8. Record the actual application, including live Nebius calls. `docs/demo-script.md` targets 2:30. Upload publicly to YouTube and verify playback. A script is not a video.
9. Replace the pending parts of the Devpost draft, add the public demo/video links and fill the official questions from actual evidence. Residence, eligibility attestations and personal feedback still need the user's answers.
10. Submit only after the required final confirmation. Re-read the entry and verify **Submitted** and a submission timestamp.

## Service IDs

- Site: `appgprj_6ae2fae3cb108191970e9c3f387ac6e3`
- Successful private deployment: `appgdep_6ae302d2c0088191bfc4b5d22e5dc9df`
- Saved version: `appgprj_6ae2fae3cb108191970e9c3f387ac6e3~appgver_89a73ad3d21081919cd93c16736ffad1`
- Deployed source snapshot: `57dc7e38edcbdee7783e6a9331e21f278d7d1255`
- Devpost project: `1515854` / `linemend`
- Devpost submission: `1270295`, Draft

The initial Sites source snapshot used the machine's existing Git identity. Before publishing to GitHub, its author was reset to the verified personal GitHub name and noreply address. The GitHub and Sites commits therefore have different IDs for the same initial source tree. Current GitHub changes after that snapshot are documentation and generated evidence assets. For future Site source updates, use the existing-Site source workflow and preserve its project ID; do not create another Site.

## Files that matter

- `lib/nebius.ts`: provider request, schema, receipt and error handling
- `lib/validation.ts`: workshop and extracted-constraint validation
- `lib/planner.ts`: search, comparison baseline, independent checks and bottleneck lower bounds
- `lib/fixtures.ts`: fictional workshop and three example notes
- `app/page.tsx`: complete browser workflow
- `test/planner.test.ts`: 18 tests
- `devpost-submission.md`: complete preparation packet and official form field IDs
- `artifacts/scenario-results.json`: reproducible computed outcomes
- `artifacts/linemend-comparison.png`: chart, not an app screenshot

There is no real-world savings, customer adoption or winning-probability claim.
