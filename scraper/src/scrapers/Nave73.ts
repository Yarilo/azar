import { firefox } from "playwright";
import Scraper from "./Scraper.js";
import { getDateFromStrings, parsePrice } from "./utils/index.js";

const PLACE_MONTH_TO_DATE_MONTH: any = {
  "enero": "january",
  "febrero": "february",
  "marzo": "march",
  "abril": "april",
  "mayo": "may",
  "junio": "june",
  "julio": "july",
  "agosto": "august",
  "septiembre": "september",
  "octubre": "october",
  "noviembre": "november",
  "diciembre": "december",
};

export default class Nave73 extends Scraper {
  website = "https://www.nave73.es/programacion/";
  name = "Nave 73";
  address = "Calle Palos de la Frontera 5, Madrid";
  place_id = "";

  constructor() {
    super();
    super.init();
  }


  async isOldEvent(page: any) {
    await page.locator("text=Comprar entradas").click()
    const isOld = await page.isVisible(":text('Lo sentimos')");
    await page.goBack();
    return isOld;
  }


  async getTitle(page: any): Promise<string> {
    const title = await page.locator("#page-heading > h1").textContent();
    return title;
  }

  async getDate(page: any): Promise<Date> {
    await page.locator("text=Comprar entradas").click()
    const dateText = await page.locator('.date').first().textContent()
    const [_1, _dayOfWeek, day, _de, rawMonth, _de2, year, _2] = dateText.replace(/\s+/g, " ").split(" ");
    const month = PLACE_MONTH_TO_DATE_MONTH[rawMonth.toLowerCase()];
    const hour = await page.locator(".time").first()
      .textContent();
    const date = getDateFromStrings({ day, month, hour, year });
    await page.goBack();
    return date;
  }

  async getPrice(page: any): Promise<number> {
    const priceString = await page.locator(':text("Precio:")')
      .textContent();
    return parsePrice(priceString);
  }

  async getDescription(page: any): Promise<string> {
    const description = await page.locator("#single-portfolio-right p").first().textContent();  // @TODO: Take always the first paragraph only?
    return description;
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

    const events = page.locator("article.portfolio-item a");
    const count = await events.count();

    for (let i = 0; i < count; i++) {
      console.log(`Processing event ${i}/${count}...`);

      const link = await events.nth(i).getAttribute("href");
      await page.goto(link);
      await page.waitForURL(link);
      try {
        const oldEvent = await this.isOldEvent(page);
        if (oldEvent) {
          console.log("Event expired, ignoring...");
          stats.eventsExpired += 1;
          await page.goBack();
          continue;
        }

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
