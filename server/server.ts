import { Application, Router, Status } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import db from "./db.ts";
import { ChosenEvent, Event, Place } from "./models/index.ts";
import { PlaceFields } from "./models/place.ts";
import { EventFields } from "./models/event.ts";

const NUMBER_OF_DAILY_EVENTS = 3; //@TODO: Move to constants;

type SelectedEvent = Event & {
  place: { name: string; website: string; address: string };
};

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function sortEvents(events: SelectedEvent[]): SelectedEvent[] {
  return events.slice().sort((
    a: any,
    b: any,
  ) => (a.date.getTime() - b.date.getTime()));
}

// @TODO: Replace any
async function populatePlace(event: any) {
  event.place = await Place.findById(event.placeId);
}

const router = new Router();
router
  .get("/places", async (context) => {
    const places = await Place.list();
    context.response.body = JSON.stringify(places);
  })
  .post("/places", async (context) => {
    const fields: PlaceFields = await context.request.body({ type: "json" })
      .value;
    const newPlace = await Place.add(fields);
    context.response.body = newPlace;
  })

// Events
router
  .get("/events", async (context) => {
    const events = await Event.list();
    context.response.body = JSON.stringify(events);
  })
  .get("/events/today", async (context) => {
    const chosenEvents: any = await ChosenEvent.listToday();

    //@TODO Sort events in the same way for both cases: Sort it by hour
    if (chosenEvents && chosenEvents.length) {
      const selectedEventsForToday = await Event.findById(
        chosenEvents.map((e: any) => e.eventId),
      ) as any;

      const populatePlacesTasks = (selectedEventsForToday || []).map(
        populatePlace,
      );
      await Promise.all(populatePlacesTasks);

      context.response.body = JSON.stringify(
        sortEvents(selectedEventsForToday),
      );
      return;
    }

    const events = await Event.listToday();
    const selectedEventsForToday = [];
    for (let i = 0; i < NUMBER_OF_DAILY_EVENTS; i++) {
      const index = getRandom(0, events.length);
      const [selectedEvent] = events.splice(index, 1) as SelectedEvent[];
      if (!selectedEvent) {
        break; // This means less than 3 events have been found
      }
      await populatePlace(selectedEvent);
      selectedEventsForToday.push(selectedEvent);
      await ChosenEvent.add({ eventId: selectedEvent.id }); // We would need to add date in the future if we deal with weekends
    }

    context.response.body = JSON.stringify(sortEvents(selectedEventsForToday));
  })
  .post("/events", async (context) => {
    const fields: EventFields = await context.request.body({ type: "json" })
      .value;
    const newPlace = await Event.add(fields);
    context.response.body = newPlace;
  })

const app = new Application();

app.use(
  oakCors({
    origin: "http://localhost:8080",
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
