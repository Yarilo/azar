
import { Application, Router, Status } from "https://deno.land/x/oak/mod.ts";
import db from './db.ts'
import {  PlaceFields } from './models.ts'


const router = new Router();
router
  .get("/places", async (context) => {
    const places = await db.listPlaces();
    context.response.body = JSON.stringify(places);
  })
  .get("/places/:id", async (context) => {
    const { id = '' } = context.params;
    if (!id)  {
      context.response.status = Status.NotFound;
      return;
    }
    const place = await db.findPlaceById(id);
    context.response.body = place;
 
  })
  .post("/places", async (context) => {
    const fields: PlaceFields = await context.request.body({ type:'json'  }).value
    const newPlace = await db.createPlace(fields);
    context.response.body = newPlace;
  })
  .put("/places/:id", async (context) => {
    const { id = '' } = context.params;
    if (!id)  {
      context.response.status = Status.NotFound;
      return;
    }
    const fields: PlaceFields = await context.request.body({ type:'json'  }).value
    const updatedPlace = await db.updatePlace(id, fields);
    context.response.body = updatedPlace;
  })
  .delete("/places/:id", async (context) => {
    await db.deletePlace(context.params.id);
    context.response.status = Status.OK
  })
  // @TODO: events




const app = new Application();

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});
// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use(router.routes());
app.use(router.allowedMethods());


await db.init();
await app.listen({ port: 4242 });