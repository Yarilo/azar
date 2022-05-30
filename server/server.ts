
import { Application, Router, Status } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import db from './db.ts'
import { Place, Event, ChosenEvent } from './models/index.ts'
import { PlaceFields } from './models/place.ts'
import { EventFields } from './models/event.ts'

const NUMBER_OF_DAILY_EVENTS = 3; //@TODO: Move to constants;

type SelectedEvent = Event & {place: {name: string, website:string, address:string } }

function getRandom(min: number, max:number) {
  return Math.random() * (max - min) + min;
}

// @TODO: Replace any
async function populatePlace(event: any) {
  event.place =  await Place.findById(event.placeId);
}

const router = new Router();
router
  .get("/places", async (context) => {
    const places = await Place.list();
    context.response.body = JSON.stringify(places);
  })
  .get("/places/:id", async (context) => {
    const { id = '' } = context.params;
    const place = await Place.findById(id);
    context.response.body = place;
 
  })
  .post("/places", async (context) => {
    const fields: PlaceFields = await context.request.body({ type:'json'  }).value
    const newPlace = await Place.add(fields);
    context.response.body = newPlace;
  })
  .put("/places/:id", async (context) => {
    const { id = '' } = context.params;
    const fields: PlaceFields = await context.request.body({ type:'json'  }).value
    const updatedPlace = await Place.edit(id, fields);
    context.response.body = updatedPlace;
  })
  .delete("/places/:id", async (context) => {
    await Place.remove(context.params.id);
    context.response.status = Status.OK
  })

// Events
router
  .get("/events", async (context) => {
    const events = await Event.list();
    context.response.body = JSON.stringify(events);
  })
  .get("/events/today", async (context) => {
    const chosenEvents:any = await ChosenEvent.list(); // @TODO: Filter today events

    //@TODO Sort events in the same way for both cases
    if (chosenEvents && chosenEvents.length) {
      const selectedEventsForToday = await Event.findById(chosenEvents.map((e: any) => e.eventId)) as any;
      
      const populatePlacesTasks = (selectedEventsForToday ||[]).map(populatePlace);
      await Promise.all(populatePlacesTasks);

      context.response.body = JSON.stringify(selectedEventsForToday);
      return;
    }
    const events = await Event.list(); // @TODO: Filter today events

    //@TODO Save them to DB or do something to have the same 3 events per day
    
    const selectedEventsForToday = [];
    for (let i=0; i< NUMBER_OF_DAILY_EVENTS; i++) {
      const index = getRandom(0, events.length);
      const [selectedEvent] = events.splice(index, 1) as SelectedEvent[]

      await populatePlace(selectedEvent);
      selectedEventsForToday.push(selectedEvent);
      await ChosenEvent.add({eventId: selectedEvent.id, date: new Date()})
    }
    
    context.response.body = JSON.stringify(selectedEventsForToday);
    
  })
  .get("/events/:id", async (context) => {
    const { id = '' } = context.params;
    const place = await Event.findById(id);
    context.response.body = place;
 
  })
  .post("/events", async (context) => {
    const fields: EventFields = await context.request.body({ type:'json'  }).value
    const newPlace = await Event.add(fields);
    context.response.body = newPlace;
  })
  .put("/events/:id", async (context) => {
    const { id = '' } = context.params;
    const fields: EventFields = await context.request.body({ type:'json'  }).value
    const updatedPlace = await Event.edit(id, fields);
    context.response.body = updatedPlace;
  })
  .delete("/events/:id", async (context) => {
    await Event.remove(context.params.id);
    context.response.status = Status.OK
  })



const app = new Application();

app.use(
  oakCors({
    origin: "http://localhost:8080"
  }),
);


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