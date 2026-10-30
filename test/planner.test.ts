import test from 'node:test';
import assert from 'node:assert/strict';
import { workshop, examples } from '../lib/fixtures.ts';
import { repair, pushBack, originalPlan, validatePlan, bottlenecks } from '../lib/planner.ts';
import { workshopSchema, validateConstraints, quotedTimes } from '../lib/validation.ts';
import { interpret, ENDPOINT } from '../lib/nebius.ts';
import type { Constraint } from '../lib/domain.ts';
const copy=()=>structuredClone(workshop);
const bad=(ps:ReturnType<typeof originalPlan>)=>validatePlan(workshop,[],ps).filter(c=>!c.passed).map(c=>c.name);

test('original plan is feasible and a clean shift needs no moves',()=>{
  assert(validatePlan(workshop,[],originalPlan(workshop)).every(c=>c.passed));
  const p=repair(workshop,[]);assert.equal(p.metrics.onTime,8);assert.equal(p.metrics.moved,0);
});
test('breakdown repair rescues three deadlines against the defined queue policy',()=>{
  const cs=examples[0].constraints,p=repair(workshop,cs),q=pushBack(workshop,cs);
  assert.equal(q.metrics.onTime,5);assert.equal(p.metrics.onTime,8);assert.equal(p.metrics.machineChanges,2);
  assert(p.checks.every(c=>c.passed));assert.equal(p.unscheduled.length,0);
});
test('late stock cannot be waved away: 150-minute lower bound is preserved',()=>{
  const cs=examples[1].constraints,p=repair(workshop,cs),proof=bottlenecks(workshop,cs);
  assert.equal(p.metrics.onTime,7);assert.equal(p.metrics.late,1);assert.equal(proof[0].gap,150);
  assert.equal(p.placements.find(p=>p.jobId==='J102')!.start,840);
});
test('single-machine bottleneck proves an urgent promise is 30 minutes late',()=>{
  const cs=examples[2].constraints,p=repair(workshop,cs),proof=bottlenecks(workshop,cs);
  assert.equal(p.metrics.onTime,7);assert.equal(proof[0].jobId,'J104');assert.equal(proof[0].gap,30);
});
test('closed workcells produce explicit unscheduled work, not impossible allocations',()=>{
  const cs:Constraint[]=workshop.machines.map((m,i)=>({id:`c${i}`,kind:'machine_down',target:m.id,start:570,end:1080,quote:'manual outage'}));
  const p=repair(workshop,cs);assert.equal(p.metrics.unscheduled,5);assert.equal(p.placements.length,3);
  assert(p.checks.filter(c=>c.name!=='Every job accounted for').every(c=>c.passed));
});
test('downtime conflicting with locked work returns an unresolved plan',()=>{
  const cs:Constraint[]=[{id:'c1',kind:'machine_down',target:'CNC-1',start:480,end:600,quote:'manual conflict'}];
  const p=repair(workshop,cs);assert(!p.checks.find(c=>c.name==='Downtime respected')!.passed);
  assert.equal(p.placements.find(p=>p.jobId==='J101')!.start,480);
});
test('half-open boundaries allow a job ending exactly when downtime starts',()=>{
  const cs:Constraint[]=[{id:'c1',kind:'machine_down',target:'CNC-1',start:570,end:780,quote:'manual outage'}];
  const p=repair(workshop,cs);assert(p.checks.every(c=>c.passed));
});
test('independent validator catches duplicate jobs and overlaps',()=>{
  const ps=originalPlan(workshop);ps.push({...ps[0]});
  assert(bad(ps).includes('Every job accounted for'));assert(bad(ps).includes('No machine overlaps'));
});
test('independent validator rejects incompatible routes, durations and locked moves',()=>{
  const ps=originalPlan(workshop);ps[0]={...ps[0],machineId:'LASER',start:600,end:650};
  assert(bad(ps).includes('Machine compatibility & duration'));assert(bad(ps).includes('Locked work unchanged'));
});
test('input import rejects unknown routes, overlapping original slots and duplicate IDs',()=>{
  const a=copy();a.jobs[0].eligible[0].machineId='NO-SUCH-MACHINE';assert(!workshopSchema.safeParse(a).success);
  const b=copy();b.jobs[2].original.start=600;assert(!workshopSchema.safeParse(b).success);
  const c=copy();c.jobs[1].id=c.jobs[0].id;assert(!workshopSchema.safeParse(c).success);
  assert(workshopSchema.safeParse(workshop).success);
});
test('example quotes and times are all grounded in their handover notes',()=>{
  for(const e of examples)assert.deepEqual(validateConstraints(workshop,e.constraints,e.note),[]);
});
test('invented evidence or times are rejected',()=>{
  const c=structuredClone(examples[0].constraints);c[0].quote='CNC-1 is down until 11:00';assert(validateConstraints(workshop,c,examples[0].note).length>0);
  const d=structuredClone(examples[0].constraints);d[0].end=810;assert(validateConstraints(workshop,d,examples[0].note).some(s=>s.includes('grounded')));
});
test('conflicting deadlines and unknown entities are rejected',()=>{
  const cs:Constraint[]=[{id:'a',kind:'deadline',target:'J102',start:0,end:780,quote:'manual deadline'},{id:'b',kind:'deadline',target:'J102',start:0,end:800,quote:'manual deadline'}];
  assert(validateConstraints(workshop,cs).some(s=>s.includes('conflicting')));cs[0].target='J999';assert(validateConstraints(workshop,cs).some(s=>s.includes('known')));
});
test('time grounding supports explicit clocks and noon without confusing 12-hour time',()=>{
  assert.deepEqual(quotedTimes('from 9:30 am until 1:00 pm'),[570,780]);
  assert(quotedTimes('from 09:30 until 13:00').includes(780));assert.deepEqual(quotedTimes('at noon'),[720]);
});
test('model request uses Nebius and strict structured output; receipt reflects response',async()=>{
  let called=false;
  const fake=(async(url:RequestInfo|URL,init?:RequestInit)=>{called=true;assert.equal(url,ENDPOINT);const b=JSON.parse(init!.body as string);assert.equal(b.response_format.type,'json_schema');assert(b.model.startsWith('nvidia/'));assert.equal(b.chat_template_kwargs.enable_thinking,false);return Response.json({id:'test-only-response',model:b.model,choices:[{finish_reason:'stop',message:{content:JSON.stringify({constraints:examples[0].constraints,questions:[]})}}],usage:{prompt_tokens:100,completion_tokens:20}});}) as typeof fetch;
  const r=await interpret(examples[0].note,workshop,'test-key','nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B',fake);
  assert(called);assert.equal(r.receipt!.requestId,'test-only-response');assert.equal(r.receipt!.inputTokens,100);
});
test('provider errors and truncated output never become fabricated results',async()=>{
  await assert.rejects(()=>interpret(examples[0].note,workshop,'test-key',undefined,(async()=>new Response('',{status:401})) as typeof fetch),/rejected/);
  await assert.rejects(()=>interpret(examples[0].note,workshop,'test-key',undefined,(async()=>Response.json({choices:[{finish_reason:'length',message:{content:'{}'}}]})) as typeof fetch),/did not finish/);
});
test('model output with an invented time fails before it can reach the scheduler',async()=>{
  const cs=structuredClone(examples[0].constraints);cs[0].end=795;
  const fake=(async()=>Response.json({choices:[{finish_reason:'stop',message:{content:JSON.stringify({constraints:cs,questions:[]})}}]})) as typeof fetch;
  await assert.rejects(()=>interpret(examples[0].note,workshop,'test-key',undefined,fake),/evidence check failed/);
});
test('a generic completed-work instruction cannot lock an unnamed unfinished job',async()=>{
  const constraints=[...examples[0].constraints,{id:'unsupported_lock',kind:'lock_job',target:'J106',start:0,end:0,quote:'Keep completed jobs in their original slots.'}];
  const fake=(async()=>Response.json({choices:[{finish_reason:'stop',message:{content:JSON.stringify({constraints,questions:[]})}}]})) as typeof fetch;
  await assert.rejects(()=>interpret(examples[0].note,workshop,'test-key',undefined,fake),/quote does not identify its target/);
});
test('sampled disruptions preserve physical constraints across 60 deterministic cases',()=>{
  let seed=901;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<60;i++){
    const end=600+Math.floor(rand()*31)*15;
    const cs:Constraint[]=[{id:'outage',kind:'machine_down',target:i%2?'CNC-1':'CNC-2',start:570,end,quote:'generated test case'},{id:'material',kind:'material_delay',target:'J106',start:0,end:570+Math.floor(rand()*20)*15,quote:'generated test case'}];
    const p=repair(workshop,cs,12000);
    assert(p.checks.filter(c=>c.name!=='Every job accounted for').every(c=>c.passed),`Case ${i}: ${JSON.stringify(p.checks)}`);
    assert.equal(p.placements.length+p.unscheduled.length,8);
    assert(p.metrics.onTime>=pushBack(workshop,cs).metrics.onTime);
  }
});
