import { overlaps } from "./domain.ts";
import type { Workshop, Constraint, Job, Placement, Plan, Metrics, Check } from "./domain.ts";

export const dueFor = (job: Job, constraints: Constraint[]) => constraints.filter(c=>c.kind==="deadline"&&c.target===job.id).at(-1)?.end ?? job.due;
export const releaseFor = (job: Job, constraints: Constraint[]) => Math.max(job.release, ...constraints.filter(c=>c.kind==="material_delay"&&c.target===job.id).map(c=>c.end));
export const locked = (job: Job, w: Workshop, cs: Constraint[]) => !!job.locked || job.original.start < w.now || cs.some(c=>c.kind==="lock_job"&&c.target===job.id);
export function originalPlan(w: Workshop): Placement[] {
  return w.jobs.map(j=>({jobId:j.id, machineId:j.original.machineId, start:j.original.start, end:j.original.start+j.eligible.find(e=>e.machineId===j.original.machineId)!.minutes}));
}
export function measure(w: Workshop, cs: Constraint[], ps: Placement[]): Metrics {
  let onTime=0, late=0, tardiness=0, moved=0, machineChanges=0, shift=0;
  for (const p of ps) {
    const j=w.jobs.find(j=>j.id===p.jobId)!;
    const delta=Math.max(0,p.end-dueFor(j,cs));
    if(delta) late++; else onTime++;
    tardiness+=delta*j.priority;
    if(p.machineId!==j.original.machineId||p.start!==j.original.start) moved++;
    if(p.machineId!==j.original.machineId) machineChanges++;
    shift+=Math.abs(p.start-j.original.start);
  }
  return {onTime,late,tardiness,moved,machineChanges,shift,unscheduled:w.jobs.length-ps.length};
}
export function validatePlan(w: Workshop, cs: Constraint[], ps: Placement[]): Check[] {
  const checks: Check[] = ["Every job accounted for", "Machine compatibility & duration", "No machine overlaps", "Downtime respected", "Material available", "Locked work unchanged", "Within the shift"].map(name=>({name,passed:true,details:[]}));
  const fail=(i:number,s:string)=>{checks[i].passed=false;checks[i].details.push(s);};
  const seen=new Set<string>();
  for(const p of ps){
    const j=w.jobs.find(j=>j.id===p.jobId);
    if(!j){fail(0,`Unknown job ${p.jobId}`);continue;}
    if(seen.has(p.jobId))fail(0,`${p.jobId} appears twice`);
    seen.add(p.jobId);
    const e=j.eligible.find(e=>e.machineId===p.machineId);
    if(!e||!Number.isInteger(p.start)||!Number.isInteger(p.end)||p.end-p.start!==e.minutes)fail(1,`${j.id}: incompatible route or duration`);
    if(cs.some(c=>c.kind==="machine_down"&&c.target===p.machineId&&overlaps(p,c)))fail(3,`${j.id} intersects downtime on ${p.machineId}`);
    if(p.start<releaseFor(j,cs))fail(4,`${j.id} starts before its material arrives`);
    if(locked(j,w,cs)&&(p.start!==j.original.start||p.machineId!==j.original.machineId))fail(5,`${j.id} was moved`);
    if(p.start<w.shiftStart||p.end>w.shiftEnd||(!locked(j,w,cs)&&p.start<w.now))fail(6,`${j.id} falls outside its allowed working hours`);
  }
  for(const j of w.jobs)if(!seen.has(j.id))fail(0,`${j.id} could not be placed`);
  for(let a=0;a<ps.length;a++)for(let b=a+1;b<ps.length;b++)if(ps[a].machineId===ps[b].machineId&&overlaps(ps[a],ps[b]))fail(2,`${ps[a].jobId} overlaps ${ps[b].jobId}`);
  return checks;
}

// A finite, deterministic schedule repair search. It enumerates dispatch orders,
// compatible routes and earliest/original starts. It never claims global optimality.
// Fixed setups are included in durations. Operators and multi-stage routes are out of scope.
function earliest(w: Workshop, cs: Constraint[], placed: Placement[], j: Job, machineId: string, duration: number, notBefore: number) {
  let start=Math.max(w.now, releaseFor(j,cs), notBefore);
  const occupied=[...placed.filter(p=>p.machineId===machineId),...cs.filter(c=>c.kind==="machine_down"&&c.target===machineId)].sort((a,b)=>a.start-b.start);
  for(const b of occupied){if(start+duration<=b.start)break;if(start<b.end&&start+duration>b.start)start=b.end;}
  return start;
}
const score = (m: Metrics) => [m.unscheduled+m.late, m.unscheduled, m.tardiness, m.moved, m.machineChanges, m.shift];
const better=(a:number[], b:number[])=>{for(let i=0;i<a.length;i++){if(a[i]!==b[i])return a[i]<b[i];}return false;};
function result(w:Workshop,cs:Constraint[],ps:Placement[],explored:number,complete:boolean,t0:number):Plan {
  return {placements:ps.sort((a,b)=>a.start-b.start||a.jobId.localeCompare(b.jobId)),unscheduled:w.jobs.filter(j=>!ps.some(p=>p.jobId===j.id)).map(j=>j.id),metrics:measure(w,cs,ps),checks:validatePlan(w,cs,ps),explored,complete,elapsedMs:Math.round(performance.now()-t0)};
}
export function repair(w: Workshop, cs: Constraint[], maxNodes=70000): Plan {
  const t0=performance.now();
  const originals=originalPlan(w);
  const fixed=originals.filter(p=>locked(w.jobs.find(j=>j.id===p.jobId)!,w,cs));
  // Contradictions involving frozen work cannot be repaired by silently moving it.
  const fixedChecks=validatePlan({...w,jobs:w.jobs.filter(j=>fixed.some(p=>p.jobId===j.id))},cs,fixed);
  if(fixedChecks.some(c=>!c.passed))return result(w,cs,fixed,0,true,t0);
  const pending=w.jobs.filter(j=>!locked(j,w,cs));
  const baseline=pushBack(w,cs);
  let best=baseline.placements, bestScore=score(baseline.metrics), explored=0, capped=false;
  const memo=new Set<string>();
  function search(todo: Job[], placed: Placement[], deferred: number) {
    if(explored>=maxNodes){capped=true;return;}
    explored++;
    const partial=measure(w,cs,placed);
    if(partial.late+deferred>bestScore[0])return;
    if(!todo.length){const s=score(measure(w,cs,placed));if(better(s,bestScore)){best=[...placed];bestScore=s;}return;}
    const key=todo.map(j=>j.id).sort().join(",")+"|"+placed.map(p=>`${p.jobId}:${p.machineId}:${p.start}`).sort().join(",");
    if(memo.has(key))return;memo.add(key);
    for(const j of [...todo].sort((a,b)=>dueFor(a,cs)-dueFor(b,cs)||b.priority-a.priority)){
      const rest=todo.filter(t=>t.id!==j.id);
      for(const e of j.eligible){
        const starts=new Set([earliest(w,cs,placed,j,e.machineId,e.minutes,w.now),earliest(w,cs,placed,j,e.machineId,e.minutes,j.original.start)]);
        for(const start of starts){if(start+e.minutes<=w.shiftEnd)search(rest,[...placed,{jobId:j.id,machineId:e.machineId,start,end:start+e.minutes}],deferred);}
      }
      // Leaving an impossible job unplaced must remain an explicit outcome.
      if(deferred+partial.late<bestScore[0])search(rest,placed,deferred+1);
    }
  }
  search(pending,fixed,0);
  return result(w,cs,[...best],explored,!capped,t0);
}

// Comparison policy: retain each machine's original queue, shift jobs forward
// around disruptions, do not move jobs between machines or reorder the queue.
export function pushBack(w: Workshop, cs: Constraint[]): Plan {
  const t0=performance.now();const placed:Placement[]=[];
  for(const p of originalPlan(w))if(locked(w.jobs.find(j=>j.id===p.jobId)!,w,cs))placed.push(p);
  for(const machine of w.machines){
    let cursor=w.now;
    for(const j of w.jobs.filter(j=>j.original.machineId===machine.id&&!locked(j,w,cs)).sort((a,b)=>a.original.start-b.original.start)){
      const duration=j.eligible.find(e=>e.machineId===machine.id)!.minutes;
      const start=earliest(w,cs,placed,j,machine.id,duration,Math.max(cursor,j.original.start));
      cursor=start+duration;
      if(cursor<=w.shiftEnd)placed.push({jobId:j.id,machineId:machine.id,start,end:cursor});
    }
  }
  return result(w,cs,placed,0,true,t0);
}

export function bottlenecks(w:Workshop,cs:Constraint[]) {
  return w.jobs.filter(j=>!locked(j,w,cs)).flatMap(j=>{
    const possible=j.eligible.map(e=>({machine:e.machineId,end:earliest(w,cs,originalPlan(w).filter(p=>locked(w.jobs.find(j=>j.id===p.jobId)!,w,cs)),j,e.machineId,e.minutes,w.now)+e.minutes}));
    const first=Math.min(...possible.map(x=>x.end));
    return first>dueFor(j,cs)?[{jobId:j.id,earliestFinish:first,due:dueFor(j,cs),gap:first-dueFor(j,cs),reason:releaseFor(j,cs)>dueFor(j,cs)?"Material arrives after the deadline.":j.eligible.length===1?"Its only compatible machine is unavailable too long.":"Even an otherwise empty shop cannot finish this job by its deadline."}]:[];
  });
}
