import { expect, test } from "@playwright/test";
import Libertad8 from "./Libertad8.js";

const EXPECTED_EVENT_URL =
  "http://libertad8cafe.es/event/ioma-e-isabel-andres/";
const EXPECTED_EVENT = {
  date: new Date('2022-07-22T16:00:00.000Z'),
  description: "Concierto acústico de Ioma e isabel andrés.",
  place_id: "",
  price: 8,
  title: "Concierto de Ioma e isabel andrés ",
  url: "http://libertad8cafe.es/event/ioma-e-isabel-andres/",
}
  ;

// @TODO: Type
test("Processes a known event successfully", async ({ page }: { page: any }) => {
  const scraper = new Libertad8();
  await page.goto(EXPECTED_EVENT_URL);

  const processedEvent = await scraper.processEvent(page);
  expect(processedEvent).toStrictEqual(EXPECTED_EVENT);
});
