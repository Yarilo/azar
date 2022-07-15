import { test, expect } from '@playwright/test';
import LaEscaleraDeJacob from "./LaEscaleraDeJacob.js";

const EXPECTED_EVENT_URL = 'https://www.laescaleradejacob.es/evento/872/soy-una-persona-horrible-';
const EXPECTED_EVENT = {
  title: 'SOY UNA PERSONA HORRIBLE',
  date: new Date('2022-07-15T20:00:00.000Z'),
  price: 10,
  url: 'https://www.laescaleradejacob.es/evento/872/soy-una-persona-horrible-',
  description: '\n' +
    '                            Eva es una adolescente. No hay nada de malo en ello, si no fuera porque Eva tiene 40 años. Eva no tiene pareja, ni hijos, ni un trabajo estable, ni carnet de conducir, ni casa… Vive… Vuelve a vivir con su madre. Su madre… Es demasiado largo para contarlo en una sinopsis… Eva es inmadura, viciosa, juerguista, deprimente, absurda, incongruente, blandengue, llorica, algo gilipollas… En definitiva, una persona horrible que vive un drama dentro de una comedia. Soy una persona horrible es un espectáculo para una sola actriz y muchos personajes.\n' +
    '                        ',
  place_id: ''
}

// @TODO: Type
test('Processes a known event successfully', async ({ page }: { page: any }) => {
  const scraper = new LaEscaleraDeJacob();
  await page.goto(EXPECTED_EVENT_URL);

  const processedEvent = await scraper.processEvent(page);

  expect(processedEvent).toStrictEqual(EXPECTED_EVENT)
});