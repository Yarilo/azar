
import { firefox } from 'playwright';
import { default as axios } from 'axios';

type EventFields = {
    title: string,
    description: string,
    price: string, //@TODO Enforce a number here, one of the events fail because it says  "desde.."
    date: Date,
    url: string,
    placeId: string;
    // @TODO: Images
}


const MONTH_NAME_TO_NUMBER: any = {
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

export default class umbralDeLaPrimavera {

    url = 'http://elumbraldeprimavera.com/evento/';
    name = 'El Umbral de La Primavera'
    placeId = '1'; // @TODO: Adjust

    constructor() { }

    parseDate(dateText: string) {
        const [day, rawMonthName, year, _1, _2, rawHour] = parseTextField(dateText).split(' ');
        const month = MONTH_NAME_TO_NUMBER[rawMonthName.split(',')[0]] as string;
        const hour = rawHour.split('Europe')[0];
        const date = new Date(`${month} ${day}, ${year} ${hour}`); //All times GMT, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
        return date;
    }

    parsePrice(price: string) {
        return parseTextField(price);
    }

    async isOldEvent(page: any) {
        const dateText = await page.locator(':text("Cuando:") + div').textContent();
        const date = this.parseDate(dateText);
        const now = new Date();
        return date < now;
    }
    async processEvent(page: any): Promise<EventFields> { // @TODO: Process text fields
        const title = await page.locator('.entry-title').first().textContent();
        const date = await page.locator(':text("Cuando:") + div').textContent();
        const price = await page.locator(':text("Precio:") + div').textContent();
        const url = await page.url();
        const description = await page.locator('p[style*="text-align: justify;"]').first().textContent(); // All justify-content are descriptions,taking the first one for now
        return {
            title,
            date: this.parseDate(date),
            price: this.parsePrice(price).split('€')[0],
            url,
            description,
            placeId: this.placeId,
        }
    }

    async fetchEvents() {
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
        console.log(`Finish processing events for ${this.name}:${this.url}`)
        console.log(`Stats: ${JSON.stringify(stats)}`);
    }

    async saveEvent(event: EventFields) {
        const request = axios.create({ baseURL: 'http://localhost:4242' });
        await request.post(`/events`, event);
    }

}