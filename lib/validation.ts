import { z } from "zod";
import type { Constraint, Workshop } from "./domain.ts";

const minute=z.number().int().min(0).max(1440);
const ident=z.string().min(1).max(40).regex(/^[A-Za-z0-9_-]+$/);
export const workshopSchema=z.object({
  name:z.string().min(1).max(80),shiftStart:minute,shiftEnd:minute,now:minute,
  machines:z.array(z.object({id:ident,name:z.string().min(1).max(80),description:z.string().max(150)}).strict()).min(1).max(6),
  jobs:z.array(z.object({id:ident,name:z.string().min(1).max(80),customer:z.string().max(80),quantity:z.number().int().min(1).max(100000),
    eligible:z.array(z.object({machineId:ident,minutes:z.number().int().min(5).max(600)}).strict()).min(1).max(6),
    release:minute,due:minute,priority:z.number().int().min(1).max(5),
    original:z.object({machineId:ident,start:minute}).strict(),locked:z.boolean().optional(),
  }).strict()).min(1).max(10),
}).strict().superRefine((w,ctx)=>{
  const issue=(message:string)=>ctx.addIssue({code:z.ZodIssueCode.custom,message});
  if(w.shiftStart>=w.shiftEnd||w.now<w.shiftStart||w.now>w.shiftEnd)issue("Shift times must be ordered, with now inside the shift.");
  if(new Set(w.machines.map(m=>m.id)).size!==w.machines.length)issue("Machine IDs must be unique.");
  if(new Set(w.jobs.map(j=>j.id)).size!==w.jobs.length)issue("Job IDs must be unique.");
  for(const j of w.jobs){
    if(new Set(j.eligible.map(e=>e.machineId)).size!==j.eligible.length)issue(`${j.id}: duplicate machine route.`);
    if(j.eligible.some(e=>!w.machines.some(m=>m.id===e.machineId)))issue(`${j.id}: unknown machine.`);
    const original=j.eligible.find(e=>e.machineId===j.original.machineId);
    if(!original)issue(`${j.id}: original machine is not an eligible route.`);
    if(j.release>w.shiftEnd||j.due<w.shiftStart||j.due>w.shiftEnd)issue(`${j.id}: release or deadline is outside the shift.`);
    if(j.original.start<Math.max(j.release,w.shiftStart)||(original&&j.original.start+original.minutes>w.shiftEnd))issue(`${j.id}: original slot is invalid.`);
  }
  for(let a=0;a<w.jobs.length;a++)for(let b=a+1;b<w.jobs.length;b++){
    const x=w.jobs[a],y=w.jobs[b];if(x.original.machineId!==y.original.machineId)continue;
    const dx=x.eligible.find(e=>e.machineId===x.original.machineId)?.minutes??0;
    const dy=y.eligible.find(e=>e.machineId===y.original.machineId)?.minutes??0;
    if(x.original.start<y.original.start+dy&&y.original.start<x.original.start+dx)issue(`Original slots overlap: ${x.id}, ${y.id}.`);
  }
});
export const constraintSchema=z.object({id:ident,kind:z.enum(["machine_down","material_delay","deadline","lock_job"]),target:ident,start:minute,end:minute,quote:z.string().min(5).max(500)}).strict();
export const extractionSchema=z.object({constraints:z.array(constraintSchema).max(12),questions:z.array(z.string().min(1).max(300)).max(5)}).strict();
export const requestSchema=z.object({note:z.string().trim().min(10).max(4000),workshop:workshopSchema}).strict();

export function quotedTimes(quote:string):number[]{
  const out:number[]=[];
  for(const m of quote.matchAll(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/gi)){
    const h=Number(m[1]),min=Number(m[2]??0);if(h>=1&&h<=12&&min<60)out.push(h%12*60+min+(m[3].toLowerCase()==="pm"?720:0));
  }
  for(const m of quote.matchAll(/\b([01]?\d|2[0-3]):([0-5]\d)\b(?!\s*[ap]m)/gi))out.push(Number(m[1])*60+Number(m[2]));
  if(/\bnoon\b/i.test(quote))out.push(720);
  if(/\bmidnight\b/i.test(quote))out.push(0);
  return out;
}
export function validateConstraints(w:Workshop,cs:Constraint[],note?:string):string[]{
  const errors:string[]=[];
  if(new Set(cs.map(c=>c.id)).size!==cs.length)errors.push("Constraint IDs are repeated.");
  for(const c of cs){
    const machine=w.machines.find(m=>m.id===c.target), job=w.jobs.find(j=>j.id===c.target);
    if(c.kind==="machine_down"?!machine:!job)errors.push(`${c.target} is not a known ${c.kind==="machine_down"?"machine":"job"}.`);
    if(c.kind==="machine_down"&&(c.start>=c.end||c.start<w.shiftStart||c.end>w.shiftEnd))errors.push(`${c.id}: downtime must fall inside the shift and end after it starts.`);
    if(c.kind!=="machine_down"&&c.kind!=="lock_job"&&(c.end<w.shiftStart||c.end>w.shiftEnd))errors.push(`${c.id}: time is outside this shift.`);
    if(c.kind!=="machine_down"&&c.start!==0)errors.push(`${c.id}: start must be zero for this constraint type.`);
    if(note!==undefined){
      if(!note.includes(c.quote))errors.push(`${c.id}: evidence is not an exact quote from the note.`);
      const entityName=(c.kind==="machine_down"?machine?.name:job?.name)?.toLowerCase();
      if(!c.quote.toLowerCase().includes(c.target.toLowerCase())&&!(entityName&&c.quote.toLowerCase().includes(entityName)))errors.push(`${c.id}: the quote does not identify its target.`);
      const times=quotedTimes(c.quote);
      if(c.kind!=="lock_job"&&!times.includes(c.end))errors.push(`${c.id}: end time is not grounded in the quoted text. Use an explicit time.`);
      if(c.kind==="machine_down"&&!times.includes(c.start))errors.push(`${c.id}: outage start time is not grounded in the quoted text.`);
    }
  }
  const deadlines=new Map<string,number>();
  for(const c of cs.filter(c=>c.kind==="deadline")){if(deadlines.has(c.target)&&deadlines.get(c.target)!==c.end)errors.push(`${c.target} has conflicting deadlines. Clarify the note.`);deadlines.set(c.target,c.end);}
  return errors;
}
