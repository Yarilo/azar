import {
  Database,
  PostgresConnector,
  PostgresOptions,
} from "https://deno.land/x/denodb/mod.ts";
import { ChosenEvent, Event, Place, User } from "./models/index.ts";
import { Relationships } from "https://deno.land/x/denodb/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

const MOCK_DESCRIPTION =
  " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tempor tempor odio ut euismod. Curabitur sollicitudin turpis lorem, sit amet laoreet nulla posuere at. Integer auctor interdum mi at tincidunt. Aliquam ullamcorper eros eu augue tristique, ac sagittis turpis condimentum. Phasellus interdum nisi quam, nec gravida justo elementum vel. Nulla ut enim consectetur est vulputate tempor eu vestibulum tellus. Sed sagittis fermentum quam, blandit fringilla massa viverra eu. Proin ac rhoncus risus. ";

// Needed for deno deploy: https://github.com/JamesBroadberry/deno-bcrypt/issues/26
const hash = (password: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const hasshedPassword = bcrypt.hashSync(password);
    resolve(hasshedPassword);
  });

const createUser = async () => {
  const username = Deno.env.get("AZAR_USERNAME");
  const password = Deno.env.get("AZAR_PASSWORD");
  if (!username || !password) {
    throw new Error(
      "No credentials found in env variables while creating initial user",
    );
  }
  const hashedPassword = await hash(password);
  await User.add({ username, password: hashedPassword });
  console.log(`User ${username} added to the db successfully`);
};

const populateDBWithDummyData = async () => {
  const TODAY_TEST_EVENTS = 3;
  const OTHER_DAYS_TEST_EVENTS = 3;

  // @TODO: Put this info in the scrapers and save it from there
  await Place.add({
    name: "El Umbral de La Primavera",
    website: "http://test1.com",
    address: "Calle de La Primavera, 11",
  });
  await Place.add({
    name: "La Escalera de Jacob",
    website: "http://test2.com",
    address: "Calle de Lavapiés, 9",
  });

  await Place.add({
    name: "Cafe El Despertar",
    website: "http://test3.com",
    address: "Calle de la Torrecilla del Leal, 18",
  });

  for (let i = 0; i < TODAY_TEST_EVENTS; i++) {
    await Event.add({
      title: `test-from-today-event-${i}`,
      description: MOCK_DESCRIPTION,
      date: new Date(), // Date is stored as UTC always
      price: 50,
      url: `http://test${i}.com`,
      placeId: "1",
    });
  }

  for (let i = 0; i < OTHER_DAYS_TEST_EVENTS; i++) {
    await Event.add({
      title: `test-other-day-event-${i}`,
      description: MOCK_DESCRIPTION,
      date: new Date("2022-06-18"),
      price: 50,
      url: `http://test-other-day${i}.com`,
      placeId: "1",
    });
  }
};

const getDBConfig = (): PostgresOptions => {
  const dbConfig = {
    database: Deno.env.get("AZAR_DB_NAME"),
    host: Deno.env.get("AZAR_DB_HOST"),
    username: Deno.env.get("AZAR_DB_USERNAME"),
    password: Deno.env.get("AZAR_DB_PASSWORD"),
    port: Number(Deno.env.get("AZAR_DB_PORT")),
  };
  Object.entries(dbConfig).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`Error getting db config, no value found for: ${key}`);
    }
  });
  return dbConfig as PostgresOptions;
};

async function init() {
  const dbConfig = getDBConfig();
  const connector = new PostgresConnector(dbConfig);
  const db = new Database(connector);

  await Relationships.belongsTo(Event, Place);
  await Relationships.belongsTo(ChosenEvent, Event);
  await db.link([Place, Event, ChosenEvent, User]);
  await db.sync({ drop: true }); // @TODO: Drop true only useful while testing I guess?

  //await populateDBWithDummyData();
  await createUser();
  console.log("DB started!");
}

export default { init };
