import { mkdir, writeFile } from 'node:fs/promises';
import { interpret } from '../lib/nebius.ts';
import { workshop, examples } from '../lib/fixtures.ts';
import { repair } from '../lib/planner.ts';
const key=process.env.NEBIUS_API_KEY;
if(!key){console.error('NEBIUS_API_KEY is missing. No live call was made.');process.exit(2);}
const results=[];
for(const example of examples){
  const interpretation=await interpret(example.note,workshop,key,process.env.NEBIUS_MODEL);
  if(interpretation.questions.length)throw new Error(`${example.id}: unexpected clarification: ${interpretation.questions.join(' ')}`);
  const plan=repair(workshop,interpretation.constraints);
  if(!plan.checks.every(c=>c.passed))throw new Error(`${example.id}: schedule validation failed`);
  const expected=example.id==='breakdown'?8:7;
  if(plan.metrics.onTime!==expected)throw new Error(`${example.id}: expected ${expected} on-time jobs, got ${plan.metrics.onTime}`);
  results.push({example:example.id,interpretation,plan});
  console.log(`${example.id}: ${plan.metrics.onTime}/8 on time; ${interpretation.receipt?.model}; request ${interpretation.receipt?.requestId}`);
}
await mkdir('artifacts',{recursive:true});
await writeFile('artifacts/live-nebius-results.json',JSON.stringify({verifiedAt:new Date().toISOString(),results},null,2)+'\n');
console.log('Three live Nebius runs passed; evidence saved without the API key.');
