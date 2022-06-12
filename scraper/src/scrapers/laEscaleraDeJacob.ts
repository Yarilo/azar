
import { firefox } from 'playwright';
import Scraper from './Scraper.js';
import { getDateFromStrings, now } from './utils/index.js';

// We are asuming three letters per month...currently only `jun` is shown.
const PLACE_MONTH_TO_DATE_MONTH: any = {
    'ene': 'january',
    'feb': 'february',
    'mar': 'march',
    'abr': 'april',
    'may': 'may',
    'jun': 'june',
    'jul': 'july',
    'ago': 'august',
    'sep': 'september',
    'oct': 'october',
    'nov': 'november',
    'dic': 'december'
}


export default class LaEscaleraDeJacob extends Scraper {

    url = 'https://www.laescaleradejacob.es/obras/filtro/formato';
    name = 'La Escalera de Jacob'
    placeId = '2';
    constructor() {
        super();
    }


    async getTitle(page: any) {
        const title = await page.locator('.title').first().textContent();
        return title;
    }

    async getDate(page: any): Promise<Date> {
        await this.scrollToBottom(page);

        const iframe = page.frameLocator('#formularioCompra');

        const day = await iframe.locator('.num_dia').first().textContent();
        const rawMonth = await iframe.locator('.mes').first().textContent();
        const month = PLACE_MONTH_TO_DATE_MONTH[rawMonth.toLowerCase()];
        const year = String(new Date().getFullYear()); // Assuming always current year...this will break in NYE! :D 
        const rawHour = await iframe.locator('.time-session').first().textContent();
        const hour = rawHour.replace(/\s+/g, '').replace('h', '');

        const date = new Date(`${month} ${day}, ${year} ${hour}`); 
        return date;
    }

    async getPrice(page: any): Promise<number> {
        await this.scrollToBottom(page);
        const iframe = page.frameLocator('#formularioCompra');
        const priceString = await iframe.locator('ins.bold').first().textContent();
        return Number(priceString.split('€')[0]);
    }

    async getDescription(page: any) {
        const description = await page.locator('.description').first().textContent();
        return description;
    }


    async processEvent(page: any): Promise<any> {
        return {
            title: await this.getTitle(page),
            date: await this.getDate(page),
            price: await this.getPrice(page),
            url: super.getUrl(page),
            description: await this.getDescription(page),
            placeId: this.placeId,
        }
    }

    async scrollToBottom(page: any) {
        await page.evaluate(async () => {// https://github.com/microsoft/playwright/issues/4302#issuecomment-1132919529
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
            //@ts-ignore
            for (let i = 0; i < document.body.scrollHeight; i += 100) {
                //@ts-ignore
                window.scrollTo(0, i);
                await delay(100);
            }
        });
    }

    async isOldEvent(page: any) {
        // We take the date from the "Hasta cuando" text instead of the iframe, which sometimes it does not show
        const rawDate = await page.locator('p.f-f-tahoma', { hasText: /[0-9][0-9]\// }).textContent();
        const [day, rawMonth] = rawDate.split(':')[1].split('/')
        const parsedMonthName = rawMonth.toLowerCase().replace(/[^a-zA-Z]+/g, '');
        const month = PLACE_MONTH_TO_DATE_MONTH[parsedMonthName];
        const year = String(new Date().getFullYear());
        const date = getDateFromStrings({ month, year, day });
        return date < now();
    }

    async fetchEvents() {
        console.log(`Processing events for ${this.name}: ${this.url}`)

        const stats = { eventsProcessed: 0, eventsSaved: 0, eventsExpired: 0, errors: 0 };
        const browser = await firefox.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(this.url);

        await this.scrollToBottom(page);
        const events = page.locator('.item-title'); // @TODO: To a `get events` ?
        const count = await events.count();
        for (let i = 0; i < count; i++) {
            console.log(`Processing event ${i}/${count}...`);

            const text = await events.nth(i).textContent();
            await page.click(`text=${text}`);


            const oldEvent = await this.isOldEvent(page);
            if (oldEvent) {
                console.log('Event expired, ignoring...')
                stats.eventsExpired += 1;
                await page.goBack();
                continue;
            }
            try {
                const processedEvent = await this.processEvent(page); // Sometimes there are timeouts checking for the iframe inside every event, so we put this iniside the try catch
                stats.eventsProcessed += 1;

                await super.saveEvent(processedEvent);
                console.log(`Event ${i}/${count} saved`);
                stats.eventsSaved += 1;
            } catch (error: any) {
                console.log(`Error trying to process or save event: ${error.statusMessage || error}`)
                stats.errors += 1;
            }
            await page.goBack();
        }

        console.log(`Finish processing events for ${this.name}: ${this.url}`)
        console.log(`Stats: ${JSON.stringify(stats)}`);
    }

}