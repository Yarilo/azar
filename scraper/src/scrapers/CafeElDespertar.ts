import { firefox } from "playwright";
import Scraper from "./Scraper.js";
import { getDateFromStrings, getFirstParagraph, parsePrice } from "./utils/index.js";

// We are asuming three letters per month...currently only `jun` is shown.
const PLACE_MONTH_TO_DATE_MONTH: any = {
  "ene": "january",
  "feb": "february",
  "mar": "march",
  "abr": "april",
  "may": "may",
  "jun": "june",
  "jul": "july",
  "ago": "august",
  "sep": "september",
  "oct": "october",
  "nov": "november",
  "dic": "december",
};

export default class CafeElDespertar extends Scraper {
  website = "https://cafeeldespertar.com/programacion/";
  name = "Cafe El Despertar";
  address = "Calle de la Torrecilla del Leal, 18";
  place_id = "";

  constructor() {
    super();
    super.init();
  }

  async getTitle(page: any): Promise<string> {
    const title = await page.locator(".mec-single-title").textContent();
    return title;
  }

  async getDate(page: any): Promise<Date> {
    const dateText = await page.locator(".mec-start-date-label").textContent();
    const [day, rawMonth, year] = dateText.split(" ");
    const month = PLACE_MONTH_TO_DATE_MONTH[rawMonth.toLowerCase()];
    const hour = await page.locator(".mec-single-event-time .mec-events-abbr")
      .textContent();
    const date = getDateFromStrings({ day, month, hour, year });
    return date;
  }

  async getPrice(page: any): Promise<number> {
    const priceString = await page.locator(".mec-events-event-cost")
      .textContent();
    return parsePrice(priceString);
  }

  async getDescription(page: any): Promise<string> {
    const description = await page.locator(".mec-single-event-description")
      .textContent();
    return getFirstParagraph(description);
  }

  async processEvent(page: any): Promise<any> {
    return {
      title: await this.getTitle(page),
      date: await this.getDate(page),
      price: await this.getPrice(page),
      url: super.getUrl(page),
      description: await this.getDescription(page),
      place_id: this.place_id,
    };
  }

  async fetchEvents() {
    console.log(`Processing events for ${this.name}: ${this.website}`);

    const stats = {
      eventsProcessed: 0,
      eventsSaved: 0,
      eventsExpired: 0,
      errors: 0,
    };
    const browser = await firefox.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(this.website);

    const events = page.locator("text=Info y reservas");
    const count = await events.count();

    for (let i = 0; i < count; i++) {
      console.log(`Processing event ${i}/${count}...`);

      const link = await events.nth(i).getAttribute("href");
      await page.goto(link);
      await page.waitForURL(link);
      try {
        const processedEvent = await this.processEvent(page);
        stats.eventsProcessed += 1;

        await super.saveEvent(processedEvent);
        console.log(`Event ${i}/${count} saved`);
        stats.eventsSaved += 1;
      } catch (error: any) {
        console.log(
          `Error trying to process or save event: ${error.statusMessage || error
          }`,
        );
        stats.errors += 1;
      }
      await page.goBack();
    }

    console.log(`Finish processing events for ${this.name}: ${this.website}`);
    console.log(`Stats: ${JSON.stringify(stats)}`);
  }
}
