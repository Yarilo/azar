
import { serve } from "https://deno.land/std@0.135.0/http/server.ts";

const handler = async (req: Request): Promise<Response> => {
    console.log("Method:", req.method);
  
    const url = new URL(req.url);
    console.log("Path:", url.pathname);
    console.log("Query parameters:", url.searchParams);
  
    console.log("Headers:", req.headers);
  
    if (req.body) {
      const body = await req.text();
      console.log("Body:", body);
    }
  
    return new Response("que pasooo señoressss");
  }
// To listen on port 4242.
serve(handler, { port: 4242 });