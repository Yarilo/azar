
import { Application, Router, Status } from "https://deno.land/x/oak/mod.ts";
import db from './db.ts'
import {  PlaceFields } from './models.ts'


const router = new Router();
router
  .get("/places", async (context) => {
    const places = await db.listPlaces();
    context.response.body = JSON.stringify(places);
  })
  .post("/places", async (context) => {
    const fields: PlaceFields = await context.request.body({ type:'json'  }).value
    const newPlace = await db.createPlace(fields);
    context.response.body = newPlace;
  })
  .delete("/places/:id", async (context) => {
    await db.deletePlace(context.params.id);
    context.response.status = Status.OK
  })
  // @TODO: PUT
  // @TODO: events




const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());


await db.init();
await app.listen({ port: 4242 });