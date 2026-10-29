export type Machine = { id: string; name: string; description: string };
export type Job = {
  id: string; name: string; customer: string; quantity: number;
  eligible: { machineId: string; minutes: number }[];
  release: number; due: number; priority: number;
  original: { machineId: string; start: number };
  locked?: boolean;
};
export type Workshop = {
  name: string; shiftStart: number; shiftEnd: number; now: number;
  machines: Machine[]; jobs: Job[];
};
export type Constraint = {
  id: string; kind: "machine_down" | "material_delay" | "deadline" | "lock_job";
  target: string; start: number; end: number; quote: string;
};
export type Interpretation = {
  constraints: Constraint[]; questions: string[];
  source: "example" | "nebius";
  receipt?: { model: string; requestId: string; inputTokens: number; outputTokens: number; latencyMs: number; timestamp: string };
};
export type Placement = { jobId: string; machineId: string; start: number; end: number };
export type Check = { name: string; passed: boolean; details: string[] };
export type Metrics = { onTime: number; late: number; unscheduled: number; tardiness: number; moved: number; machineChanges: number; shift: number };
export type Plan = { placements: Placement[]; unscheduled: string[]; metrics: Metrics; checks: Check[]; explored: number; complete: boolean; elapsedMs: number };
export const clock = (n: number) => `${Math.floor(n / 60).toString().padStart(2, "0")}:${(n % 60).toString().padStart(2, "0")}`;
export const minutes = (s: string) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
export const overlaps = (a: {start: number; end: number}, b: {start: number; end: number}) => a.start < b.end && b.start < a.end;
export function constraintLabel(c: Constraint) {
  if (c.kind === "machine_down") return `${c.target} unavailable ${clock(c.start)}–${clock(c.end)}`;
  if (c.kind === "material_delay") return `${c.target} material ready at ${clock(c.end)}`;
  if (c.kind === "deadline") return `${c.target} due at ${clock(c.end)}`;
  return `${c.target} must keep its original slot`;
}
