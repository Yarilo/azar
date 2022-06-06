import { Database, PostgresConnector } from "https://deno.land/x/denodb/mod.ts";
import { ChosenEvent, Event, Place } from "./models/index.ts";
import { Relationships } from "https://deno.land/x/denodb/mod.ts";

const MOCK_DESCRIPTION =
  " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tempor tempor odio ut euismod. Curabitur sollicitudin turpis lorem, sit amet laoreet nulla posuere at. Integer auctor interdum mi at tincidunt. Aliquam ullamcorper eros eu augue tristique, ac sagittis turpis condimentum. Phasellus interdum nisi quam, nec gravida justo elementum vel. Nulla ut enim consectetur est vulputate tempor eu vestibulum tellus. Sed sagittis fermentum quam, blandit fringilla massa viverra eu. Proin ac rhoncus risus. ";

const populateDBWithDummyData = async () => {
  const TEST_EVENTS = 0;

  await Place.add({
    name: "Placetest",
    website: "http://test.com",
    address: "test, 1, 4",
  });
  for (let i = 0; i < TEST_EVENTS; i++) {
    await Event.add({
      title: `test-event-${i}`,
      description: MOCK_DESCRIPTION,
      date: new Date(),
      price: 50,
      url: "http://test.com",
      placeId: "1",
    });
  }
};

async function init() {
  const connector = new PostgresConnector({
    database: "azar",
    host: "localhost",
    username: "azar",
    password: "test",
    port: 5432,
  });

  const db = new Database(connector);

  await Relationships.belongsTo(Event, Place);
  await Relationships.belongsTo(ChosenEvent, Event);
  await db.link([Place, Event, ChosenEvent]);
  await db.sync({ drop: true }); // @TODO: Drop true only useful while testing I guess?

  await populateDBWithDummyData();

  console.log("DB started!");
}

export default { init };
