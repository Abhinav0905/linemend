import {writeFile} from 'node:fs/promises';
import {workshop,examples} from '../lib/fixtures.ts';
import {repair,pushBack,dueFor} from '../lib/planner.ts';
import type {Plan} from '../lib/domain.ts';
const c=examples[0].constraints,q=pushBack(workshop,c),r=repair(workshop,c);
const palette=['#dcc8b4','#c1d9df','#ead99f','#cbdcbb','#d3d9c8','#d8c6df','#bad4d8','#c7d9b7'];
function panel(y:number,label:string,plan:Plan,highlight:boolean){
 let s=`<rect x="66" y="${y}" width="1468" height="294" rx="20" fill="white" stroke="#dfe5dc"/><text x="94" y="${y+39}" font-size="23" fill="#294232" font-weight="600">${label}</text><rect x="1330" y="${y+17}" width="175" height="36" rx="18" fill="${highlight?'#e4f1da':'#f8e7dc'}"/><text x="1417" y="${y+41}" text-anchor="middle" fill="${highlight?'#426c2c':'#a5643e'}" font-size="18" font-weight="700">${plan.metrics.onTime}/8 on time</text>`;
 const x=250,width=1215,at=(t:number)=>x+(t-480)/600*width;
 for(let i=0;i<=10;i++)s+=`<text x="${at(480+i*60)}" y="${y+78}" font-size="12" text-anchor="middle" fill="#7a8c6e">${String(8+i).padStart(2,'0')}:00</text>`;
 workshop.machines.forEach((m,i)=>{
 const top=y+92+i*59;s+=`<text x="94" y="${top+24}" font-size="17" font-weight="600" fill="#576c4a">${m.id}</text>`;
 for(let j=0;j<=10;j++)s+=`<path d="M${at(480+j*60)},${top-4}v52" stroke="#edf1e5"/>`;
 if(m.id==='CNC-1')s+=`<rect x="${at(570)}" y="${top-3}" width="${at(780)-at(570)}" height="50" rx="5" fill="url(#hatch)" stroke="#c99b76" stroke-dasharray="4 4"/><text x="${at(675)}" y="${top+26}" text-anchor="middle" font-size="13" fill="#a77d57">UNAVAILABLE 09:30–13:00</text>`;
 for(const p of plan.placements.filter(p=>p.machineId===m.id)){
 const j=workshop.jobs.find(j=>j.id===p.jobId)!,late=p.end>dueFor(j,c),color=palette[workshop.jobs.indexOf(j)];
 s+=`<rect x="${at(p.start)+1}" y="${top}" width="${at(p.end)-at(p.start)-2}" height="43" rx="6" fill="${color}" stroke="${late?'#c36e4e':color}" stroke-width="${late?3:1}"/><text x="${at(p.start)+10}" y="${top+17}" font-size="12" font-weight="700" fill="#405338">${j.id}${late?' · LATE':''}</text><text x="${at(p.start)+10}" y="${top+33}" font-size="11" fill="#54684b">${j.name}</text>`;
 }
 });return s;
}
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000"><defs><pattern id="hatch" patternUnits="userSpaceOnUse" width="9" height="9" patternTransform="rotate(35)"><rect width="9" height="9" fill="#faf3ea"/><path d="M0 0v9" stroke="#e6ceb8" stroke-width="1"/></pattern></defs><rect width="1600" height="1000" fill="#f4f7ef"/><g font-family="Arial,Helvetica,sans-serif"><rect x="66" y="52" width="45" height="45" rx="12" fill="#d35c3c"/><path d="M79 65v8c0 6 18 2 18 8v5" fill="none" stroke="white" stroke-width="3"/><circle cx="79" cy="64" r="3" fill="white"/><circle cx="97" cy="87" r="3" fill="white"/><text x="127" y="87" font-size="34" font-weight="700" fill="#263d2e">LineMend</text><text x="1533" y="82" text-anchor="end" font-size="14" letter-spacing="2" fill="#7b8e6d">WORKSHOP RECOVERY</text><text x="66" y="163" font-size="45" font-weight="700" fill="#263d2e">The mill stops. The whole day doesn't have to.</text><text x="66" y="208" font-size="21" fill="#7b8e6d">A defined comparison. The same jobs, routes, downtime and deadlines.</text>${panel(253,'Keep the original machine queues',q,false)}${panel(570,'Search alternate routes and job orders',r,true)}<text x="66" y="917" font-size="20" font-weight="700" fill="#416331">3 deadlines recovered · 2 machine changes · 7 feasibility checks passed</text><text x="66" y="953" font-size="15" fill="#81936f">Calculated scheduler example. Fictional data. No live model call. Not a screenshot of the app.</text><text x="1534" y="953" text-anchor="end" font-size="15" fill="#81936f">MIT · github.com/Abhinav0905/linemend</text></g></svg>`;
await writeFile('artifacts/linemend-comparison.svg',svg);
const logo=`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="#f4f7ef"/><rect x="226" y="125" width="148" height="148" rx="39" fill="#d35c3c"/><path d="M268 168v27c0 21 64 7 64 31v22" fill="none" stroke="white" stroke-width="10"/><circle cx="268" cy="165" r="11" fill="white"/><circle cx="332" cy="249" r="11" fill="white"/><text x="300" y="357" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="69" font-weight="700" fill="#263d2e">LineMend</text><text x="300" y="407" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="23" fill="#698452">Recover the working day.</text><text x="300" y="495" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="14" letter-spacing="3" fill="#8ba171">WORKSHOP RECOVERY LAB</text></svg>`;
await writeFile('artifacts/linemend-mark.svg',logo);
