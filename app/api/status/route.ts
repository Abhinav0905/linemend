import { env } from "cloudflare:workers";
import { DEFAULT_MODEL } from "@/lib/nebius";
export async function GET(){
  const config=env as unknown as Record<string,string|undefined>;
  return Response.json({configured:!!config.NEBIUS_API_KEY,model:config.NEBIUS_MODEL||DEFAULT_MODEL,provider:"Nebius Token Factory"},{headers:{"Cache-Control":"no-store"}});
}
