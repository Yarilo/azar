import { expect, test } from "@playwright/test";
import CafeElDespertar from "./CafeElDespertar.js";

const EXPECTED_EVENT_URL =
  "https://cafeeldespertar.com/events/1550-615-420-668-647-601-132-563-528/";
const EXPECTED_EVENT = {
  title: "DANRAIN QUARTET",
  date: new Date("2022-07-09T20:00:00.000Z"),
  price: 10,
  url:
    "https://cafeeldespertar.com/events/1550-615-420-668-647-601-132-563-528/",
  description:
    'Dan Rain Quartet es una nueva formación madrileña que rinde homenaje a los crooners del jazz, al jazz vocal, a los boleros,\n' +
    'la bossa nova, el funk y el soul, versionando los temas más audaces del género y atreviéndose con temas propios.\n' +
    'Una nueva apuesta que conlleva frescura, talento, experiencia, transmitiendo mucho groove y felicidad.\n' +
    'Dan Rain – Voz\n' +
    'Manu Cano – Guitarra\n' +
    'Juan Bageneta – Bajo\n' +
    'Greg Meson – batería\n' +
    '\n' +
    'Invitado : Juan Pablo Quintero – Saxo\n',
  place_id: "",
};

// @TODO: Type
test("Processes a known event successfully", async ({ page }: { page: any }) => {
  const scraper = new CafeElDespertar();
  await page.goto(EXPECTED_EVENT_URL);

  const processedEvent = await scraper.processEvent(page);
  expect(processedEvent).toStrictEqual(EXPECTED_EVENT);
});
