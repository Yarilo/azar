import { firefox } from "playwright";
import Scraper from "./Scraper.js";
import { getDateFromStrings, parsePrice } from "./utils/index.js";

const capitalize = (title: string): string => title.charAt(0).toUpperCase() + title.slice(1);
const parseTitle = (title: string): string => capitalize(title.toLowerCase()); // @TODO: Capitalize when name is like "pepe y pepa"

export default class Libertad8 extends Scraper {
  website = "http://libertad8cafe.es/event-grid-3-view/";
  name = "Libertad 8";
  address = "Calle Libertad, 8";
  place_id = "";

  constructor() {
    super();
    super.init();
  }

  async getTitle(page: any): Promise<string> {
    const rawTitle = await page.locator(".page-header").textContent();
    const title = parseTitle(rawTitle);

    const allHTML = await page.locator('#content').innerHTML();
    if (title.includes('Micro')) return title.replace('  ', ' '); // Micro titles comes with two spaces
    // Some events have more than one category, but to simplify, we only take one for now
    const rawCategories = allHTML.match(/event_cat-(poesia|conciertos|cuentacuentos)/g);
    const [category] = rawCategories.map((c: string) => c.replace('event_cat-', ''));
    if (category === 'poesia') return `Poesía con ${title}`
    if (category === 'cuentacuentos') return `Cuentacuentos por ${title}`
    if (category === 'conciertos') return `Concierto de ${title} `
    return title;
  }

  async getDate(page: any): Promise<Date> {
    const dateText = await page.locator("span.event-date").textContent();
    const [day, month, year] = dateText.split("/");
    const hourText = await page.locator("span.event-time")
      .textContent();

    // Convert from AM/PM to 24 hour
    const dateInAMPM = new Date(`2000-01-01 ${hourText}`);
    const hour = `${dateInAMPM.getHours()}: ${dateInAMPM.getMinutes()}`
    const date = getDateFromStrings({ day, month, hour, year });
    return date;
  }

  async getPrice(page: any): Promise<number> {
    const priceString = await page.locator(".btn-pricing")
      .textContent();
    if (!priceString.includes('€')) return 0; // @TODO: Consider free places in db
    return parsePrice(priceString);
  }

  async getDescription(page: any): Promise<string> {
    const rawTitle = parseTitle(await page.locator(".page-header").textContent());
    const title = await this.getTitle(page);
    if (title.includes('Micro')) return rawTitle.replace('  ', ' ');  // Micro titles comes with two spaces
    if (title.includes('Concierto')) return `Concierto acústico de ${rawTitle}.`;
    if (title.includes('Poesía')) return `Recital de poesía de ${rawTitle}`
    return title;
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
    console.log(`Processing events for ${this.name}: ${this.website} `);

    const stats = {
      eventsProcessed: 0,
      eventsSaved: 0,
      eventsExpired: 0,
      errors: 0,
    };
    const browser = await firefox.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(this.website);

    const events = page.locator(".event .media-heading a");
    const count = await events.count();

    for (let i = 0; i < count; i++) {
      console.log(`Processing event ${i} /${count}...`);

      const link = await events.nth(i).getAttribute("href"); // @TODO If we try to use the same thing to click we could probable move this whole method to the base scraper
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

    console.log(`Finish processing events for ${this.name}: ${this.website} `);
    console.log(`Stats: ${JSON.stringify(stats)} `);
  }
}
