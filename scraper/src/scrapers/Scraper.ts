import { EventFields } from '../types/index.js';
import { default as axios } from 'axios';

abstract class Scraper {

    abstract getTitle(page: any): Promise<string>;

    abstract getDate(page: any): Promise<Date>;

    abstract getPrice(page: any): Promise<number>;

    abstract getDescription(page: any): Promise<string>

    abstract processEvent(page: any): Promise<EventFields>;


    getUrl(page: any): string {
        return page.url();
    }
    async saveEvent(event: EventFields): Promise<void> {
        const request = axios.create({ baseURL: 'http://localhost:4242' });
        await request.post(`/events`, event);
    }

    abstract fetchEvents(): Promise<void>;
}

export default Scraper;