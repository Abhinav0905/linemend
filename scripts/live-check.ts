import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { interpret } from '../lib/nebius.ts';
import { workshop, examples } from '../lib/fixtures.ts';
import { repair } from '../lib/planner.ts';
import type { Constraint } from '../lib/domain.ts';
const key=process.env.NEBIUS_API_KEY;
if(!key){console.error('NEBIUS_API_KEY is missing. No live call was made.');process.exit(2);}
const results=[];
const normalize=(cs:Constraint[])=>cs.map(({kind,target,start,end})=>({kind,target,start,end})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
for(const example of examples){
  const interpretation=await interpret(example.note,workshop,key,process.env.NEBIUS_MODEL);
  if(interpretation.questions.length)throw new Error(`${example.id}: unexpected clarification: ${interpretation.questions.join(' ')}`);
  assert.deepEqual(normalize(interpretation.constraints),normalize(example.constraints),`${example.id}: extracted constraints must match the fixture, not just produce the same on-time count`);
  const plan=repair(workshop,interpretation.constraints);
  if(!plan.checks.every(c=>c.passed))throw new Error(`${example.id}: schedule validation failed`);
  const expected=example.id==='breakdown'?8:7;
  if(plan.metrics.onTime!==expected)throw new Error(`${example.id}: expected ${expected} on-time jobs, got ${plan.metrics.onTime}`);
  results.push({example:example.id,interpretation,plan});
  console.log(`${example.id}: ${plan.metrics.onTime}/8 on time; ${interpretation.receipt?.model}; request ${interpretation.receipt?.requestId}`);
}
const clarificationResults=[];
for(const note of [
  'CNC-1 is down from 09:30. It might be back by 13:00, but maintenance has not confirmed the time.',
  'CNC-9 is unavailable from 09:30 until 13:00.',
]){
  const interpretation=await interpret(note,workshop,key,process.env.NEBIUS_MODEL);
  assert.ok(interpretation.questions.length>0,'Uncertain recovery and unknown machines must request clarification.');
  assert.equal(interpretation.constraints.length,0,'Do not invent a constraint from an uncertain time or unknown machine.');
  clarificationResults.push({note,interpretation});
  console.log(`Clarification verified: ${interpretation.questions.join(' ')}`);
}
await mkdir('artifacts',{recursive:true});
await writeFile('artifacts/live-nebius-results.json',JSON.stringify({verifiedAt:new Date().toISOString(),results,clarificationResults},null,2)+'\n');
console.log('Three live fixture extractions and two clarification checks passed; evidence saved without the API key.');
