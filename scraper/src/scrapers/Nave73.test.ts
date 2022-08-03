import { expect, test } from "@playwright/test";
import Nave73 from "./Nave73.js";

const EXPECTED_EVENT_URL =
  "https://www.nave73.es/portfolio-item/oye-la-lluvia-bajo-este-paraguas-2/";
const EXPECTED_EVENT = {
  description: "Oye la lluvia bajo este paraguas propone una perspectiva casi de ciencia ficción para explorar la intimidad en las interacciones entre los cuerpos, humanos y no-humanos. La vorágine de aplicaciones de citas en línea y los dispositivos tecnológicos enfocando su mirada en nosotrxs lleva a una especulación sobre el deseo que nos salva de la soledad. ¿Cuáles son los límites de un cuerpo? ¿Puedo intimar con una máquina?",
  place_id: "",
  price: 12,
  title: "OYE LA LLUVIA BAJO ESTE PARAGUAS",
  url: "https://www.nave73.es/portfolio-item/oye-la-lluvia-bajo-este-paraguas-2/",
}


// @TODO: Type
test("Processes a known event successfully", async ({ page }: { page: any }) => {
  const scraper = new Nave73();
  await page.goto(EXPECTED_EVENT_URL);

  const processedEvent = await scraper.processEvent(page);
  // Getting the date for Nave73 won't be possible if the event is expired, so we don't check it to avoid flakyness
  const { date, ...restOfEvent } = processedEvent;
  expect(restOfEvent).toStrictEqual(EXPECTED_EVENT);
});
