
import { firefox } from 'playwright';
import { default as axios } from 'axios';
import { EventFields } from '../types/index.js';
import Scraper from './Scraper.js';
import { getDateFromStrings, now } from './utils/index.js';

const PLACE_MONTH_TO_DATE_MONTH: any = {
    'enero': 'january',
    'febrero': 'february',
    'marzo': 'march',
    'abril': 'april',
    'mayo': 'may',
    'junio': 'june',
    'julio': 'july',
    'agosto': 'august',
    'septiembre': 'september',
    'octubre': 'october',
    'noviembre': 'november',
    'diciembre': 'december'
}

const parseTextField = (text = '') => text.replace(/\n/g, '').replace(/\t/g, '');

export default class ElUmbralDeLaPrimavera extends Scraper {

    url = 'http://elumbraldeprimavera.com/evento/';
    name = 'El Umbral de La Primavera'
    placeId = '1'; // @TODO: Adjust

    constructor() {
        super();
    }

    parseDate(dateText: string) {
        const [day, rawMonthName, year, _1, _2, rawHour] = parseTextField(dateText).replace(/\s+/g, ' ').split(' ');
        const monthName = rawMonthName.replace(',', '');
        const month = PLACE_MONTH_TO_DATE_MONTH[monthName] as string;
        const hour = rawHour?.split('Europe')[0] || ''; // "Repeated" dates have no explicit hour
        const date = getDateFromStrings({ month, year, hour, day });
        return date;
    }

    async getAllSessionsDate(page: any): Promise<string[]> {
        // The event may have more sessions so we have to trigger a popup that happens when hovering over a "repeats" button
        const popupClass = '.ai1ec-in';
        await page.hover('text=Repeats');
        const datesText = await page.locator(popupClass).first().textContent();
        return datesText.split('\n')
    }

    async getTitle(page: any) {
        const title = await page.locator('.entry-title').first().textContent();
        return title;
    }

    async getDate(page: any): Promise<Date> {
        const dateText = await page.locator(':text("Cuando:") + div').textContent();
        let date = await this.parseDate(dateText);

        const oldDate = date < now();
        const hasOtherSessions = await page.$("text=Repeats");
        if (oldDate && hasOtherSessions) {
            const sessionsDates = await this.getAllSessionsDate(page);
            sessionsDates.forEach((dateText: string) => {
                const parsedDate = this.parseDate(dateText);
                if (parsedDate > now()) date = parsedDate;
            })
        }
        return date;
    }

    async getPrice(page: any): Promise<number> {
        const priceString = await page.locator(':text("Precio:") + div').textContent();
        const numbersOnlyPrice = priceString.replace(/[^0-9.€]/g, '');
        return Number(numbersOnlyPrice.split('€')[0]);
    }

    getUrl(page: any) {
        return page.url();
    }

    async getDescription(page: any) {
        const description = await page.locator('p[style*="text-align: justify;"]').first().textContent(); // All justify-content are descriptions,taking the first one for now
        return description;
    }


    async isOldEvent(page: any) {
        const date = await this.getDate(page);
        return date < now();
    }

    async processEvent(page: any): Promise<EventFields> {
        return {
            title: await this.getTitle(page),
            date: await this.getDate(page),
            price: await this.getPrice(page),
            url: this.getUrl(page),
            description: await this.getDescription(page),
            placeId: this.placeId,
        }
    }

    async fetchEvents() {
        console.log(`Processing events for ${this.name}: ${this.url}`)

        const stats = { eventsProcessed: 0, eventsSaved: 0, eventsExpired: 0, errors: 0 };
        const browser = await firefox.launch({ headless: true })
        const page = await browser.newPage();
        await page.goto(this.url);
        const events = page.locator('.entry-title');
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

            const processedEvent = await this.processEvent(page);
            stats.eventsProcessed += 1;
            try {
                await this.saveEvent(processedEvent);
                console.log(`Event ${i}/${count} saved`);
                stats.eventsSaved += 1;
            } catch (error: any) {
                console.log(`Error trying to save event: ${error.statusMessage || error}`)
                stats.errors += 1;
            }

            await page.goBack();
        }

        console.log(`Finish processing events for ${this.name}: ${this.url}`)
        console.log(`Stats: ${JSON.stringify(stats)}`);
    }

    async saveEvent(event: EventFields) {
        const request = axios.create({ baseURL: 'http://localhost:4242' });
        await request.post(`/events`, event);
    }

}