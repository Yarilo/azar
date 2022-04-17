
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
            if (req.method === 'GET') {
                const places = await db.list();
                return new Response(JSON.stringify(places));
            } 
            // @TODO POST, PUT
        case '/events':
            return new Response('todo will return events')
        default:
            return new Response(STATUS_TEXT.get(Status.NotFound), {status:Status.NotFound})
    }  }


await db.init();
serve(handler, { port: 4242 });

console.log('Server started!')

