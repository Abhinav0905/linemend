# LineMend recorded demo script

[Watch the public 2:38 video](https://www.youtube.com/watch?v=xEctEMZColA). Recorded October 30, 2026. The footage contains actual app interactions and two live model calls.

## 0:00: The problem

A workshop has eight orders due today. At nine thirty, a mill breaks down and material is late. The handover tells the supervisor what happened. It does not tell them which jobs can still finish, or which promises are now impossible.

## 0:20: Our approach

LineMend turns that handover into a plan the supervisor can inspect. NVIDIA Nemotron, running on Nebius Token Factory, reads the note. The supervisor checks the extracted constraints. A scheduling engine then tries compatible machines and job sequences, and independently checks the result.

## 0:43: Live handover interpretation

Here is the original day and the handover. We are making a real call to Nemotron. It extracts the C N C one outage and the material arrival for job J one oh six. Each constraint includes the source quote and a time we can check or correct. Nothing changes until the supervisor confirms. Completed work stays in its original slot.

## 1:15: The recovery result

The recovered plan finishes all eight orders on time. Keeping the old machine queues finishes only five on time. LineMend moves work to compatible machines and changes the sequence. The proposed moves are listed below, alongside seven checks for routes, overlaps, downtime, stock, completed work and shift boundaries. These are calculated results for a fictional workshop.

## 1:42: An urgent order

Now consider an urgent order. Again, Nemotron reads the actual note and the supervisor reviews the constraints. Job J one oh four needs an hour on its only compatible machine. That machine returns at one, but the deadline is one thirty. The earliest possible finish is two. LineMend makes this thirty minute minimum shortfall explicit instead of inventing a workable promise.

## 2:13: A later repair estimate and export

What if the repair takes another hour? Move the estimate to two o'clock and recalculate. The minimum shortfall grows to ninety minutes. The supervisor can export the proposed schedule and its evidence for review. This prototype covers one shift and one operation per order. The next step is testing it against an anonymized real workshop schedule.

The public app is at https://linemend.linemend.workers.dev. Source and verification records are in https://github.com/Abhinav0905/linemend.
