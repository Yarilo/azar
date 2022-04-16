
import { serve } from "https://deno.land/std@0.135.0/http/server.ts";
import {
    Status,
    STATUS_TEXT,
  } from "https://deno.land/std@0.135.0/http/http_status.ts";

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
  
    switch (url.pathname) {
        case '/places':
            return new Response('todo will return places');
        case '/events':
            return new Response('todo will return events')
        default:
            return new Response(STATUS_TEXT.get(Status.NotFound), {status:Status.NotFound})
    }  }
// To listen on port 4242.
console.log('Server started!')
serve(handler, { port: 4242 });