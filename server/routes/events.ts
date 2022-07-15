import { Status } from "https://deno.land/x/oak/mod.ts";
import { ChosenEvent, Event, Place } from "../models/index.ts";
import { ProviderDB } from "../providers/index.ts";
import { timestamp } from "../utils/index.ts";

const NUMBER_OF_DAILY_EVENTS = 3; //@TODO: Move to constants;

type SelectedEvent = any & {
  place: { name: string; website: string; address: string };
};

// @TODO: TableName types
async function listToday(tableName: any) {
  const today = new Date().toISOString().split("T")[0];
  const todayAtMidnight = `${today}T00:00:00.000Z`;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const whereColumn = tableName === ChosenEvent.tableName
    ? "created_at"
    : "date";
  const eventsFromTodayAndAfter = await ProviderDB.find(
    tableName,
    "*",
    `where ${whereColumn}> ${timestamp.dateToTimestamp(todayAtMidnight)} `,
  ) as Event.columns[];

  // Cannot do multiple where clauses so we filter manually https://github.com/eveningkid/denodb/issues/197
  const todayEvents = eventsFromTodayAndAfter.filter((event: any) =>
    isToday(event.created_at)
  );
  return todayEvents;
}

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function sortEvents(events: SelectedEvent[]): SelectedEvent[] {
  return events.slice().sort((
    a: any,
    b: any,
  ) => (a.date.getTime() - b.date.getTime()));
}

// @TODO: Type
async function populatePlace(event: any) {
  const [place] = await ProviderDB.find(
    Place.tableName,
    "*",
    `where id = ${event.place_id}`,
  ) as Place.columns[];
  event.place = place;
}

const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear();
};

export default {
  add: async (context: any) => {
    const fields: Event.columns = await context.request.body({ type: "json" })
      .value;
    await ProviderDB.insert(Event.tableName, fields);
    context.response.status = Status.OK;
  },
  list: async (context: any) => {
    const events = await ProviderDB.find(
      Event.tableName,
      "*",
    ) as Event.columns[];
    context.response.body = JSON.stringify(events);
  },
  today: async (context: any) => {
    const chosenEvents: any = await listToday(ChosenEvent.tableName);
    if (chosenEvents && chosenEvents.length) {
      const selectedEventsForToday: Event.columns[] = await ProviderDB.find(
        Event.tableName,
        "*",
        `where id in (${chosenEvents.map((c: any) => c.id)})`,
      ) as Event.columns[];
      const populatePlacesTasks = (selectedEventsForToday || []).map(
        populatePlace,
      );
      await Promise.all(populatePlacesTasks);

      context.response.body = JSON.stringify(
        sortEvents(selectedEventsForToday),
      );
      return;
    }

    const events = await listToday(Event.tableName);
    const selectedEventsForToday = [];
    for (let i = 0; i < NUMBER_OF_DAILY_EVENTS; i++) {
      const index = getRandom(0, events.length);
      const [selectedEvent] = events.splice(index, 1) as SelectedEvent[];
      if (!selectedEvent) {
        break; // This means less than 3 events have been found
      }
      await populatePlace(selectedEvent);
      selectedEventsForToday.push(selectedEvent);
      await ProviderDB.insert(ChosenEvent.tableName, { id: selectedEvent.id }); // We would need to add date in the future if we deal with weekends
    }

    context.response.body = JSON.stringify(sortEvents(selectedEventsForToday));
  },
};
