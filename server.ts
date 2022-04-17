
import { serve } from "https://deno.land/std@0.135.0/http/server.ts";
import {
    Status,
    STATUS_TEXT,
  } from "https://deno.land/std@0.135.0/http/http_status.ts";
import db from './db.ts'

const handler = async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    
    switch (url.pathname) {
        case '/places':
            const places = await db.list();
            console.log('places', places)
            return new Response(places);
        case '/events':
            return new Response('todo will return events')
        default:
            return new Response(STATUS_TEXT.get(Status.NotFound), {status:Status.NotFound})
    }  }

console.log('Server started!')

await db.init();
serve(handler, { port: 4242 });
