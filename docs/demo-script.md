# LineMend recording guide

Target: 2 minutes 40 seconds. Keep the public YouTube video under 3 minutes.

Follow the same order as the app: **the problem, our approach, working details, the result**. Start at the top of the Guided demo page. Explain the problem before clicking any controls. The model calls are live, so leave a few seconds for them to finish.

| Time | Show | Say |
| --- | --- | --- |
| 0:00-0:20 | 01 / The problem. Show the handover card. | "A workshop has eight orders due today. At 9:30, a mill breaks down and material is late. The note tells the supervisor what happened. It doesn't tell them which jobs can still finish or which promises are now impossible." |
| 0:20-0:45 | 02 / Our approach. Read the three steps left to right. | "LineMend turns that handover into a plan the supervisor can inspect. NVIDIA Nemotron, running on Nebius Token Factory, reads the note. The supervisor checks the extracted constraints. A scheduling engine then tries compatible machines and job sequences and checks the result." |
| 0:45-1:20 | 03 / Work through the details. Keep Machine breakdown selected. Click Interpret with Nemotron, show source quotes and times, then Confirm & recover. | "Here is the original day and the actual handover. The model extracts the CNC-1 outage and J106's material arrival. Each constraint has a quote I can check. I can correct a time before confirming. Completed work stays locked." |
| 1:20-1:45 | 04 / The result. Show Recovery, Keep the old queue, then Recovery. Inspect proposed moves and checks. | "The old queue finishes five orders on time. This recovery gets all eight on time by moving work to compatible machines and changing the sequence. A separate validator checks routes, overlaps, downtime, stock and completed work. These are calculated results for a fictional workshop." |
| 1:45-2:20 | Return to details. Select Urgent order, interpret live, confirm, then show J104's bottleneck card in the result. | "Sometimes a promise cannot be kept. J104 needs an hour on its only compatible machine. That machine returns at 1:00, but the order is due at 1:30. Its earliest finish is 2:00. LineMend makes that 30-minute shortfall explicit." |
| 2:20-2:40 | Explore a later repair time, then Export this result. | "The supervisor can test a later repair estimate and export the schedule with its evidence. This prototype covers one shift and one operation per order. The next step is to test it with an anonymized real workshop schedule." |

Do not describe **Or review the example constraints** as a live model call. If the model asks for clarification, show it and correct the note. Do not replace a failed call with an example while describing the result as live.

Before recording, close unrelated tabs and notifications. Keep the window wide enough to show the handover beside the original schedule. Do not show an API key or billing details. Check audio and readability, trim pauses and verify the final duration is under 3 minutes.

This is a recording script. No video has been received or published yet.

App: https://linemend.linemend.workers.dev

Source: https://github.com/Abhinav0905/linemend
