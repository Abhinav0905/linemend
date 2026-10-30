# Live inference verification

Verified at 2026-10-30 00:48 UTC (October 29 Pacific). These are synthetic fixture checks, not field validation.

The final run used `nvidia/nemotron-3-super-120b-a12b` on Nebius Token Factory with temperature 0, a strict JSON schema and thinking disabled.

| Check | Result |
| --- | --- |
| Machine breakdown | Exact two constraints; recovery 8/8 on time |
| Late material | Exact two constraints; recovery 7/8 on time |
| Urgent order | Exact three constraints; recovery 7/8 on time |
| Unconfirmed recovery time | Clarification; no invented constraint |
| Unknown CNC-9 | Clarification; no invented constraint |

The five calls used 4,391 input tokens and 520 output tokens. Latency ranged from 780 to 3,877 ms. Full receipts and checked plans are in [live-nebius-results.json](../artifacts/live-nebius-results.json).

## Failures that changed the implementation

Initial Nano calls produced an unsupported deadline or a job-specific lock from a generic completed-work sentence. The evidence validator rejected those outputs. Reducing the prompt to known entity names did not resolve the Nano lock failure. A one-note comparison then returned the two expected constraints from Super; the [recorded comparison](../artifacts/extraction-model-check.json) preserves both results.

An early Super run also failed local schema validation on the urgent-order note. The exact cause of that response was not retained. A diagnostic repeat passed. We then aligned the provider schema with local identifier, quote, question and time bounds, and requested short constraint IDs. The final five-case run passed after those changes.

The unsupported-lock response is covered by a regression test. No invalid constraint was silently removed or accepted, and the adapter makes no automatic retry. This evidence supports the chosen demo setup; it does not establish a general model ranking or reliability rate.

## Standalone Cloudflare migration

On October 29 Pacific (October 30 UTC), the app moved to https://linemend.linemend.workers.dev. Anonymous HTTPS page and status requests passed. Live breakdown and urgent-order extractions matched their expected constraints and passed every scheduler check. Safari also completed a real breakdown extraction, reviewed its quotes and displayed the 8/8 recovery and 5/8 queue comparison. See `artifacts/cloudflare-live-check.json` and `artifacts/browser-qa.json`.

The old host redirects page requests and rejects write requests with 410. Its Nebius secret was removed. Its two previous calls were carried into the new shared counter; `artifacts/cloudflare-migration.json` records the cutover.
