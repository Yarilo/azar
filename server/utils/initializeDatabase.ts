import { ChosenEvent, Event, User } from "../models/index.ts";
import { ProviderDB } from "../providers/index.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import * as Place from "../models/place.ts";

const MOCK_DESCRIPTION =
  " Lorem ipsum dolor sit amét, consectetur adipiscing elit. Nullam tempor tempor odio ut euismod. Curabitur sollicitudin turpis lorem, sit amet laoreet nulla posuere at. Integer auctor interdum mi at tincidunt. Aliquam ullamcorper eros eu augue tristique, ac sagittis turpis condimentum. Phasellus interdum nisi quam, nec gravida justo elementum vel. Nulla ut enim consectetur est vulputate tempor eu vestibulum tellus. Sed sagittis fermentum quam, blandit fringilla massa viverra eu. Proin ac rhoncus risus. ";

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
  await ProviderDB.insert(User.tableName, {
    username,
    password: hashedPassword,
  });
  console.log(`User ${username} added to the db successfully`);
};

const populateDBWithDummyData = async () => {
  const TODAY_TEST_EVENTS = 3;
  const OTHER_DAYS_TEST_EVENTS = 3;

  await ProviderDB.insert(Place.tableName, {
    name: "El Umbral de La Primavera",
    website: "http://test1.com",
    address: "Calle de Lavapies, 9",
  });
  await ProviderDB.insert(Place.tableName, {
    name: "La Escalera de Jacob",
    website: "http://test2.com",
    address: "Calle de Lavapiés, 9",
  });
  await ProviderDB.insert(Place.tableName, {
    name: "Cafe El Despertar",
    website: "http://test3.com",
    address: "Calle de la Torrecilla del Leal, 18",
  });

  for (let i = 0; i < TODAY_TEST_EVENTS; i++) {
    await ProviderDB.insert(Event.tableName, {
      title: `test-from-today-event-${i}`,
      description: MOCK_DESCRIPTION,
      date: new Date(), // Date is stored as UTC always pass a timestamp?
      price: 50,
      url: `http:test${i}.com`,
      place_id: 1,
    });
  }

  for (let i = 0; i < OTHER_DAYS_TEST_EVENTS; i++) {
    await ProviderDB.insert(Event.tableName, {
      title: `test-other-day-event-${i}`,
      description: MOCK_DESCRIPTION,
      date: new Date("2022-06-18"),
      price: 50,
      url: `http:test-other-day${i}.com`,
      place_id: 1,
    });
  }
};

export default async function ({ populateWithDummyData = false }) {
  console.log('Initializating database...');
  await ProviderDB.runQuery(`SET CLIENT_ENCODING TO 'LATIN9'`); // To store accents and so on, https://www.postgresql.org/docs/current/multibyte.html
  await ProviderDB.runQuery(Place.createTableQuery);
  await ProviderDB.runQuery(Event.createTableQuery);
  await ProviderDB.runQuery(ChosenEvent.createTableQuery);
  await ProviderDB.runQuery(User.createTableQuery);
  await createUser();
  if (populateWithDummyData) {
    await populateDBWithDummyData();
    console.log('DB populated with dummy data')
  }
  console.log('DB initializated successfully!');
}
