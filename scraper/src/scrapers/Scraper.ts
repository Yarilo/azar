import { EventFields } from '../types/index.js';

abstract class Scraper {

    abstract getDate(page: any): Promise<Date>;

    abstract getPrice(page: any): Promise<number>;

    abstract getUrl(page: any): string;

    abstract getDescription(page: any): Promise<string>

    abstract isOldEvent(page: any): Promise<boolean>;

    abstract processEvent(page: any): Promise<EventFields>;

    abstract saveEvent(event: EventFields): Promise<void>;

    abstract fetchEvents(): Promise<void>;
}

export default Scraper;