
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import db from './db.ts'


const router = new Router();
router
  .get("/places", async (context) => {
    const places = await db.list();
    context.response.body = JSON.stringify(places);
  }) // @TODO: POST, PUT, DELETE
  .get("/events", async (context) => {
    context.response.body = 'TODO'
  })


const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());


await db.init();
await app.listen({ port: 4242 });