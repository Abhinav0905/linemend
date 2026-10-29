# LineMend

## One-line Summary

A machine went down. Turn the handover into a checked recovery schedule and find out which orders can still finish today.

## Problem

Small fabrication workshops need to repair a day's plan when equipment fails, stock arrives late or a deadline changes. A handover note does not say which routes remain feasible. The supervisor still needs a schedule and an honest account of the jobs that will be late.

## Solution

Read a handover note, review the extracted constraints, calculate a revised schedule, compare it with keeping the original queues and export the proposal. A counterfactual repair-time control recalculates the schedule. Impossible-deadline lower bounds identify specific shortfalls.

## Why This Matters

The next useful action is deciding which orders can finish today and which customers need a revised promise. This prototype makes that calculation visible. No measured real-workshop benefit is claimed.

## How We Used AI

The implemented adapter uses NVIDIA Nemotron on Nebius Token Factory for strict JSON constraint extraction. Returned entity names, source quotes and explicit times are checked before review. The model does not calculate the schedule. Live inference is not yet verified because account setup is pending.

## How We Used Codex

Codex researched the official requirements and indexed public entries, designed the bounded workflow, implemented the app and scheduling engine, added validation and tests, prepared the docs and deployed the private preview. The user selected the event and asked for end-to-end work within a nine-hour budget.

## Key Features

- Source-linked, editable scheduling constraints
- Alternate machine routes with machine-specific durations
- Completed-work locks, material readiness, downtime and deadlines
- An explicit old-queue comparison
- Earliest-finish lower bounds for impossible deadlines
- Repair-time counterfactuals
- JSON workshop imports and CSV/JSON exports

## Architecture

Browser note and workshop → server-side Nemotron request → schema/entity/quote/time checks → supervisor review → bounded local search → independent schedule validation → comparison and export.

## Testing Instructions

1. Open the app or run `npm ci` and `npm run dev -- --host 127.0.0.1 --port 5173` from the repository.
2. Select Machine breakdown and click "Or review the example constraints". This is explicitly a no-model example.
3. Confirm and recover. Compare 8/8 on time with 5/8 under the old-queue policy.
4. Inspect the two rerouted jobs and the seven validation checks.
5. Try Late material and Urgent order. They leave a 150-minute and 30-minute minimum shortfall, respectively.
6. Explore a different repair time and export the evidence report.
7. For live model testing, configure the server's `NEBIUS_API_KEY`, restart and use Interpret with Nemotron. Run the separate live-check script before making a live-inference claim.

## Public Demo Link

Pending public access. Current owner-private preview: https://linemend-workshop.abhinav-0905.chatgpt.site

The hosted root and status endpoint return HTTP 200 using authorized private service access. Missing-key inference returns HTTP 503 with an explicit setup message. Local browser QA also passed; see `artifacts/browser-qa.json`.

## Public Repository Link

https://github.com/Abhinav0905/linemend

MIT license detected by GitHub. Initial CI succeeded: https://github.com/Abhinav0905/linemend/actions/runs/40842143456

## Demo Video

Pending recording and public YouTube upload. The exact 2:20 outline is in `docs/demo-script.md`. Record actual live inference and browser interactions after setup. Do not describe example constraints as a live model response.

## Screenshot Shot List

1. Original plan and breakdown note
2. Live extracted constraints with exact source quotes
3. Recovered schedule beside the old-queue comparison
4. J104's unavoidable 30-minute shortfall
5. Export dialog and evidence receipt

`artifacts/linemend-comparison.png` is a calculated chart, explicitly labelled as fictional data and not an app screenshot. A project thumbnail is uploaded to the Devpost draft.

## Submission Readiness Notes

The Devpost project exists in **Draft** state, project ID 1515854, submission ID 1270295. It is not submitted. The full story draft is in `docs/submission-draft.md` and has also been saved to Devpost with its current limitations.

Completed: local app, production build, 21 tests including 60 generated cases, type checking, public MIT repository, GitHub Actions, private deployment, authenticated hosted HTTP checks, draft story, video outline and calculated comparison graphic.

Outstanding: complete API key and credits, successful runtime NVIDIA model calls, public judge access after those calls pass, actual demo recording by the user, public YouTube upload, provider-experience answers and final entry confirmation.

## Known Limitations

One shift, one operation per job, fixed setup allowances. No shared operator constraints, multi-stage routing, machine dispatch or real-workshop evaluation. Bounded candidate search, no global optimality claim. A shared D1 budget caps this demo at 100 model calls per day and 300 total. It does not cap direct API usage or other apps on the account.

## TODO Official Form Fields

- 28261 Submitter Type: proposed Individual; verify before entry.
- 28262 Organization: proposed N/A for a personal entry.
- 28265 Country of residence: needs user confirmation.
- 28266 Canadian province: needs the residence answer; do not infer from timezone.
- 28267 Track: Best apps and agents.
- 28268 New or existing: New, created October 29, 2026.
- 28270 Code repository: https://github.com/Abhinav0905/linemend
- 28271 Working demo: public access still pending.
- 28272 Models/variant: default NVIDIA Nemotron 3 Nano 30B-A3B; final answer must name the model actually used in verified runtime calls.
- 28273 Output-quality rating: pending live evidence.
- 28274 Approach: prompt engineering and strict structured output; no fine-tuning.
- 28275 Model comparison: no controlled cross-model benchmark was run. Do not invent one.
- 28276 Nebius capabilities: runtime inference and JSON schema support, subject to completing live verification.
- 28277 Recommendation rating: pending live experience.
- 28278 Cloud/local experience rating: pending live experience.
- 28279 Improvements: write from observed setup/model behavior after live testing.
- 28280 Desired Nemotron improvements: write from observed behavior after live testing.
- 28282 Tavily: No; not used in the product.
- 28283 Age checkbox: requires confirmation, not checked by the agent.
- 28284 Promotion-entity employment checkbox: requires confirmation, not checked by the agent.
- 29059 AI tools used: Codex for implementation; NVIDIA Nemotron after runtime verification.
- 29060 Learning level and 29061 career value: leave for the user's assessment.

No Codex session ID is requested by this event's live form.
