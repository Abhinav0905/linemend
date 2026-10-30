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

The implemented adapter uses NVIDIA Nemotron on Nebius Token Factory for strict JSON constraint extraction. Returned entity names, source quotes and explicit times are checked before review. The model does not calculate the schedule. Live inference passed five checks using NVIDIA Nemotron 3 Super on Nebius Token Factory. Three extracted constraint sets matched the fixtures exactly, and two uncertain/unknown-target notes requested clarification.

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

Public and verified without sign-in: https://linemend-workshop.abhinav-0905.chatgpt.site

Anonymous root, status and live interpretation requests returned HTTP 200. The live extracted breakdown constraints matched exactly and produced an 8/8 checked recovery. The four-part UI was reviewed in Safari; see `artifacts/public-live-check.json` and `artifacts/browser-qa.json`.

## Public Repository Link

https://github.com/Abhinav0905/linemend

MIT license detected by GitHub. Latest verified CI succeeded for source commit 8d098d49126eff7fba19029e16a0df863326f275: https://github.com/Abhinav0905/linemend/actions/runs/40909594346

## Demo Video

Pending recording and public YouTube upload. The exact 2:40 outline is in `docs/demo-script.md`. Record actual live inference and browser interactions after setup. Do not describe example constraints as a live model response.

## Screenshot Shot List

1. Original plan and breakdown note
2. Live extracted constraints with exact source quotes
3. Recovered schedule beside the old-queue comparison
4. J104's unavoidable 30-minute shortfall
5. Export dialog and evidence receipt

`artifacts/linemend-comparison.png` is a calculated chart, explicitly labelled as fictional data and not an app screenshot. A project thumbnail is uploaded to the Devpost draft.

## Submission Readiness Notes

The Devpost project page is **published**, project ID 1515854. The hackathon entry, submission ID 1270295, is **not submitted** and has no submitted timestamp. The full story draft is in `docs/submission-draft.md` and has also been saved to Devpost with its current limitations.

Completed: local app, production build, 22 tests including 60 generated cases, type checking, public MIT repository, GitHub Actions, public deployment, anonymous hosted inference checks, draft story, video outline and calculated comparison graphic.

Outstanding: receive the user's recording and public YouTube URL, complete the final eligibility/rules declaration and submit. The optional hackathon credit code is still pending.

## Known Limitations

One shift, one operation per job, fixed setup allowances. No shared operator constraints, multi-stage routing, machine dispatch or real-workshop evaluation. Bounded candidate search, no global optimality claim. A shared D1 budget caps this demo at 100 model calls per day and 300 total. It does not cap direct API usage or other apps on the account.

## TODO Official Form Fields

- 28261 Submitter Type: proposed Individual; verify before entry.
- 28262 Organization: proposed N/A for a personal entry.
- 28265 Country of residence: confirmed by the user; stored in ignored `.devpost-local-answers.json`.
- 28266 Canadian province: confirmed from the residence answer; stored in the local answer file.
- 28267 Track: Best apps and agents.
- 28268 New or existing: New, created October 29, 2026.
- 28270 Code repository: https://github.com/Abhinav0905/linemend
- 28271 Working demo: https://linemend-workshop.abhinav-0905.chatgpt.site (public access and anonymous live inference verified).
- 28272 Models/variant: NVIDIA Nemotron 3 Super, `nvidia/nemotron-3-super-120b-a12b`, selected after the five-case live check passed. Nano was evaluated on the breakdown note and produced an unsupported job lock.
- 28273 Output-quality rating: 8/10 for this limited extraction task. Final run: three exact fixture extractions and two appropriate clarifications; source checks and supervisor review remain necessary.
- 28274 Approach: prompt engineering and strict structured output; no fine-tuning.
- 28275 Model comparison: one synthetic note was sent to Nano and Super with the same prompt. Nano added an unsupported lock and was rejected; Super returned the two expected constraints. This is a narrow fixture comparison, not a broad benchmark.
- 28276 Nebius capabilities: hosted runtime inference, an OpenAI-compatible endpoint and JSON schema output avoided managing GPU infrastructure. Five final model calls used 4,391 input and 520 output tokens.
- 28277 Recommendation rating: 8/10 for this project. The typed API integration was small and all five final live checks passed; credit, billing and key setup required several steps.
- 28278 Cloud/local experience rating: 8/10 for this build. No GPU server setup was required. We did not run a controlled comparison with local inference or another cloud.
- 28279 Improvements: a clearly surfaced per-key hard spending cap and a setup checklist for credits, billing and keys would help short hackathon builds.
- 28280 Desired Nemotron improvements: stronger adherence to source-only extraction, especially generic instructions that must not become unsupported entity-specific constraints.
- 28282 Tavily: No; not used in the product.
- 28283 Age checkbox: adult age confirmed by the user; the local answer file contains the answer.
- 28284 Promotion-entity employment checkbox: The final declaration must cover all promotion entities, representatives, agents and affiliates.
- 29059 AI tools used: Codex for research, implementation and testing; NVIDIA Nemotron Nano for a limited extraction comparison and Nemotron Super for verified runtime extraction.
- 29060 Learning level and 29061 career value: answered by the user and stored in the local answer file.

No Codex session ID is requested by this event's live form.
