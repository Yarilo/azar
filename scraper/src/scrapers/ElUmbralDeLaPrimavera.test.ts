import { test, expect } from '@playwright/test';
import type { Page } from '@playwright'
import ElUmbralDeLaPrimavera from "./ElUmbralDeLaPrimavera.js";

const EXPECTED_EVENT_URL = 'https://elumbraldeprimavera.com/evento/feliz-lunes/';
const EXPECTED_EVENT = {
  title: 'FELIZ LUNES',
  date: new Date('2022-07-22T22:00:00.000Z'),
  price: 14,
  url: 'https://elumbraldeprimavera.com/evento/feliz-lunes/',
  description: 'Al despertar en su lunes libre, Sara descubre que su sueño se ha hecho realidad: le han ofrecido el papel protagonista de una película. Para celebrarlo, acudirá al cariño de los comentarios de su Instagram, el amor de su match de Tinder, y la compañía de sus YouTubers preferidos.',
  placeId: ''
}

test('Processes a known event successfully', async ({ page }: { page: Page }) => {
  const scraper = new ElUmbralDeLaPrimavera();
  await page.goto(EXPECTED_EVENT_URL);

  const processedEvent = await scraper.processEvent(page);
  
  expect(processedEvent).toStrictEqual(EXPECTED_EVENT)
});