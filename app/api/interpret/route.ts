import { env } from "cloudflare:workers";
import { requestSchema } from "@/lib/validation";
import { interpret, DEFAULT_MODEL } from "@/lib/nebius";
import { reserveModelCall } from "@/lib/quota";

// Per-visitor throttling is local to a Worker instance. The D1 reservation below
// separately enforces a shared 100/day and 300 total request cap for this demo.
const calls=new Map<string,{since:number,count:number}>();
export async function POST(request:Request){
  if(request.headers.get("origin")&&request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"Cross-origin requests are not accepted."},{status:403});
  const config=env as unknown as Record<string,string|undefined>;
  if(!config.NEBIUS_API_KEY)return Response.json({error:"Nebius is not connected yet. Add NEBIUS_API_KEY to the server environment. The guided examples still work, with no model call."},{status:503});
  const raw=await request.text();if(raw.length>18000)return Response.json({error:"Input is too large."},{status:413});
  let data:unknown;try{data=JSON.parse(raw);}catch{return Response.json({error:"Invalid JSON."},{status:400});}
  const parsed=requestSchema.safeParse(data);if(!parsed.success)return Response.json({error:parsed.error.issues.map(i=>i.message).join(" ")},{status:400});
  const identity=request.headers.get("oai-authenticated-user-id")||request.headers.get("cf-connecting-ip")||"local";
  const now=Date.now(), limit=calls.get(identity);
  if(limit&&now-limit.since<3600000&&limit.count>=12)return Response.json({error:"This demo allows 12 model requests per visitor per hour."},{status:429});
  if(calls.size>1000)for(const [k,v]of calls)if(now-v.since>3600000)calls.delete(k);
  try {
    if(!await reserveModelCall(env.DB))return Response.json({error:"The shared demo model budget is used up (100 requests per day, 300 total). Guided examples still work without a model call."},{status:429});
  } catch {
    return Response.json({error:"The shared demo request counter is unavailable. No model call was made. Guided examples still work."},{status:503});
  }
  calls.set(identity,{since:limit&&now-limit.since<3600000?limit.since:now,count:limit&&now-limit.since<3600000?limit.count+1:1});
  try{return Response.json(await interpret(parsed.data.note,parsed.data.workshop,config.NEBIUS_API_KEY,config.NEBIUS_MODEL||DEFAULT_MODEL),{headers:{"Cache-Control":"no-store"}});}
  catch(error){return Response.json({error:error instanceof Error?error.message:"Interpretation failed. No schedule was changed."},{status:502});}
}
