import type { Constraint, Workshop } from "./domain.ts";

// Fictional workshop. All durations include a fixed setup allowance.
// This is a scheduling demonstration, not a measured production deployment.
export const workshop: Workshop = {
  name: "Alder Works", shiftStart: 480, shiftEnd: 1080, now: 570,
  machines: [
    {id: "CNC-1", name: "Precision mill", description: "Tight-tolerance work · 3-axis"},
    {id: "CNC-2", name: "General mill", description: "Flexible routing · 3-axis"},
    {id: "LASER", name: "Laser cutter", description: "Sheet components · dedicated"},
  ],
  jobs: [
    { id: "J101", name: "Precision hubs", customer: "Northline", quantity: 24, eligible: [{machineId: "CNC-1", minutes:90}], release:480, due:600, priority:2, original:{machineId:"CNC-1", start:480}, locked:true },
    { id: "J102", name: "Pump collars", customer: "Fieldwork", quantity: 40, eligible: [{machineId: "CNC-1", minutes:90},{machineId:"CNC-2", minutes:120}], release:570, due:780, priority:3, original:{machineId:"CNC-1", start:570} },
    { id: "J103", name: "Valve sleeves", customer: "Northline", quantity: 36, eligible: [{machineId: "CNC-1", minutes:75},{machineId:"CNC-2", minutes:90}], release:570, due:840, priority:2, original:{machineId:"CNC-1", start:660} },
    { id: "J104", name: "Sensor mounts", customer: "Meridian", quantity: 18, eligible: [{machineId: "CNC-1", minutes:60}], release:570, due:900, priority:3, original:{machineId:"CNC-1", start:735} },
    { id: "J105", name: "Fixture plates", customer: "In-house", quantity: 12, eligible: [{machineId: "CNC-2", minutes:90}], release:480, due:660, priority:1, original:{machineId:"CNC-2", start:480}, locked:true },
    { id: "J106", name: "Actuator bases", customer: "Meridian", quantity: 30, eligible: [{machineId: "CNC-2", minutes:120},{machineId:"CNC-1", minutes:105}], release:570, due:900, priority:2, original:{machineId:"CNC-2", start:570} },
    { id: "J107", name: "Cable trays", customer: "Fieldwork", quantity: 60, eligible: [{machineId: "LASER", minutes:90}], release:480, due:600, priority:1, original:{machineId:"LASER", start:480}, locked:true },
    { id: "J108", name: "Panel sets", customer: "Northline", quantity: 45, eligible: [{machineId: "LASER", minutes:90}], release:570, due:810, priority:1, original:{machineId:"LASER", start:570} },
  ],
};

export const examples: {id: string; title: string; caption: string; note: string; constraints: Constraint[]}[] = [
  { id: "breakdown", title: "Machine breakdown", caption: "Recover three threatened deadlines", note: "09:30 handover: CNC-1 is down from 09:30 until 13:00. The material for J106 will not arrive until 12:30. Keep completed jobs in their original slots. The delivery deadlines have not changed.", constraints: [
    {id:"c1",kind:"machine_down",target:"CNC-1",start:570,end:780,quote:"CNC-1 is down from 09:30 until 13:00"},
    {id:"c2",kind:"material_delay",target:"J106",start:0,end:750,quote:"The material for J106 will not arrive until 12:30"},
  ] },
  { id: "stock", title: "Late material", caption: "Find the promise that cannot be kept", note: "The stock for J102 is delayed until 14:00. J102 must still be finished by 13:00. All machines are available. Do not change completed work.", constraints: [
    {id:"c1",kind:"material_delay",target:"J102",start:0,end:840,quote:"The stock for J102 is delayed until 14:00"},
    {id:"c2",kind:"deadline",target:"J102",start:0,end:780,quote:"J102 must still be finished by 13:00"},
  ] },
  { id: "promise", title: "Urgent order", caption: "Expose a machine-specific bottleneck", note: "CNC-1 is unavailable from 09:30 until 13:00. J104 now has a firm deadline of 13:30. The material for J106 arrives at 12:30. Completed work stays locked.", constraints: [
    {id:"c1",kind:"machine_down",target:"CNC-1",start:570,end:780,quote:"CNC-1 is unavailable from 09:30 until 13:00"},
    {id:"c2",kind:"deadline",target:"J104",start:0,end:810,quote:"J104 now has a firm deadline of 13:30"},
    {id:"c3",kind:"material_delay",target:"J106",start:0,end:750,quote:"The material for J106 arrives at 12:30"},
  ] },
];
