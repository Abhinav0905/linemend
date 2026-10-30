# LineMend

Tagline: A machine went down. Turn the handover into a checked recovery schedule and find out which orders can still finish today.

Track: Best apps and agents

Status: Public demo and live model checks verified. The video and final hackathon submission are pending.

## Inspiration

A small fabrication workshop can start the morning with a sensible plan and lose it in one handover. A mill is down. Stock is late. One customer wants an earlier finish. The supervisor has to work out which jobs can move and which promises need a conversation.

We wanted that conversation to start with a calculation the supervisor can inspect.

## What it does

LineMend reads a handover note, extracts source-linked constraints and proposes a revised daily schedule. The supervisor checks the assumptions first. The app then tries compatible machine routes and job orders, keeps completed work in place and compares the result with pushing the old queues back.

Every late or unplaced job stays visible. When even an otherwise empty shop cannot meet a deadline, LineMend shows the earliest possible finish and the shortfall. A repair-time slider recalculates the schedule. CSV and JSON exports preserve the proposal and its evidence.

The bundled breakdown example recovers eight on-time orders versus five under the old-queue comparison. A late-stock example leaves one order at least 150 minutes late; an urgent-order example leaves one at least 30 minutes late. All three are fictional, reproducible examples.

## How we built it

React and TypeScript provide the browser board. The server adapter calls NVIDIA Nemotron 3 Super (120B-A12B) through Nebius Token Factory using strict structured output. Schema, known-entity, source-quote and time checks run before the result reaches the review screen.

A separate deterministic engine searches job sequences and machine routes. Another validator checks allocations against the hard constraints. The language model does not invent job durations, certify machines or calculate the final schedule.

Five live provider checks passed: three exact fixture extractions and two clarification cases. Every successful call has a saved model ID, request ID, token counts and timing receipt.

## Challenges

A schedule can look convincing and still run work during downtime or before material arrives. We kept extraction, review, planning and validation separate. We also needed a comparison policy that could be explained precisely: keep the original machine queues and shift them forward without reordering or rerouting.

Live testing caught a plausible but unsupported job lock in Nano's output. The quote check rejected it. We reduced the input to entity names, clarified extraction rules, aligned the provider schema with local validation and selected Super after its five-case run passed. These are small synthetic checks, not a claim of general model superiority.

An impossible deadline is a useful output. We calculate a lower bound for each job instead of hiding it behind a successful-looking schedule.

## What we verified

Twenty-two automated tests pass, including sixty generated disruption cases. They cover physical constraints, locked-work conflicts, missing jobs, incompatible routes, invalid imports and fabricated model evidence. Type checking and the production build pass. Provider unit tests use mocked responses. A separate five-case live check passed with Nemotron Super; measured calls took 0.78-3.88 seconds. Browser checks passed for all three examples, comparison views, repair-time edits, valid and invalid imports, exports and responsive layouts. A shared database limits the hosted demo to 100 model requests per day and 300 total.

## What's next

Test with an anonymized real workshop schedule and handover. Then add shared operators and multi-stage routes, which the prototype does not yet model.

## Nebius feedback

The OpenAI-compatible endpoint and structured-output interface let us run Nemotron without managing a GPU server. The final five calls used 4,391 input tokens and 520 output tokens. Source grounding still needs application checks: valid JSON alone did not prevent an unsupported lock. A clearly surfaced per-key spending cap and an onboarding checklist for credit activation, billing and API keys would help short hackathon builds.
