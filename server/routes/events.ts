import { ChosenEvent, Event, Place, User } from "../models/index.ts";
import { EventFields } from "../models/event.ts";

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

export default {
  add: async (context: any) => {
    const fields: EventFields = await context.request.body({ type: "json" })
      .value;
    const newPlace = await Event.add(fields);
    context.response.body = newPlace;
  },
  list: async (context: any) => {
    const events = await Event.list();
    context.response.body = JSON.stringify(events);
  },
  today: async (context: any) => {
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
  },
};
