## The problem

A small fabrication workshop can lose its daily plan in one handover. A mill breaks down, stock is late and an order still has a firm deadline. The supervisor needs to know which jobs can move and which promises can no longer be kept.

LineMend makes that decision inspectable. It turns a handover note into a proposed recovery schedule, with the assumptions and missed deadlines in plain sight.

## How we solve it

NVIDIA Nemotron 3 Super runs on Nebius Token Factory and extracts downtime, material arrivals and deadlines from the note. Each constraint includes an exact source quote. The supervisor reviews the constraints before the scheduler uses them.

A deterministic scheduling engine tries compatible machines and job sequences. It keeps completed work in place. An independent validator checks routes, overlaps, downtime, material availability, locked jobs and shift boundaries.

The model reads the note. The scheduler calculates the plan. The supervisor makes the decision.

## Work through the details

The public app follows four sections: **the problem, our approach, working details and the result**.

1. Open the [public demo](https://linemend.linemend.workers.dev) and read the fictional workshop handover.
2. In the details section, keep Machine breakdown selected and click **Interpret with Nemotron**.
3. Inspect the returned quotes and times, then click **Confirm & recover**.
4. Compare **Recovery** with **Keep the old queue**, inspect the proposed moves and export the result.

Try Urgent order to see a promise that cannot be kept. Change the repair estimate to explore its effect. The JSON report preserves the original interpretation, supervisor edits, schedule and checks; CSV gives the proposed job order.

## The result

In the fictional breakdown example, the recovered plan finishes **8 of 8 orders on time**, compared with **5 of 8** under the old-queue policy. The late-stock example leaves one order at least 150 minutes late. The urgent-order example leaves J104 at least 30 minutes late: its only compatible machine returns at 13:00, the job takes an hour and its deadline is 13:30.

These are reproducible software examples. We have not measured savings or accuracy in a real workshop.

## What we built and verified

React and TypeScript provide the interface. The public app runs directly on Cloudflare Workers, with D1 for its shared request budget. Nebius serves `nvidia/nemotron-3-super-120b-a12b` through its chat-completions API with strict JSON output. Only the note and machine/job names are sent for interpretation. The API key stays on the server.

All 22 automated tests pass, including 60 generated disruption cases. Type checking and production builds pass. Five final live checks passed: three exact fixture extractions and two clarification cases. Those calls took 0.78-3.88 seconds. Anonymous hosted inference also passed, and Safari checks covered the new walkthrough, live review and result comparison.

Live testing caught an unsupported job lock in Nano's response. The source check rejected it. We tightened the prompt and schema, then selected Super after the five-case run passed. This is a small fixture evaluation, not a general model benchmark. Request receipts and the failure notes are in the [public MIT repository](https://github.com/Abhinav0905/linemend).

## Limits and next steps

This prototype covers one shift and one operation per order, with fixed setup allowances. Shared operators, multi-stage production, maintenance certification and machine dispatch are outside its scope. The bounded search makes no global optimality claim. Human review is required because a valid quote does not prove that every interpretation is correct.

The public demo has a shared limit of 100 model calls per UTC day and 300 total. Guided examples also work without a model call and are labelled clearly.

The next product test is an anonymized real workshop schedule and handover.

## AI assistance

AI was used for implementation.
