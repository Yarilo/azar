import { EventFields } from '../types/index.js';
import { default as axios } from 'axios';

const BASE_URL = 'http://localhost:4242';

export type PlaceFields = {
    name: string;
    website: string;
    address: string;
};

abstract class Scraper {

    placeId: string;
    request: any;

    website: string;
    name: string;
    address: string;

    constructor() {
        this.request = axios.create({ baseURL: BASE_URL });
        this.placeId = '';
        this.website = '';
        this.name = '';
        this.address = '';
    }


    async init() {
        try {
            await this.savePlace({ website: this.website, address: this.address, name: this.name })
        } catch (error: any) {
            console.log(`Error saving the place, probably is already in db ${error.statusMessage || error}`);
        }

        try {
            this.placeId = await this.getPlaceId(); // @TODO: This call is not needed if the one above succeeds
        } catch (error: any) {
            console.log(`Error initializating place id, ${error.statusMessage || error}`)
        }
    }


    abstract getTitle(page: any): Promise<string>;

    abstract getDate(page: any): Promise<Date>;

    abstract getPrice(page: any): Promise<number>;

    abstract getDescription(page: any): Promise<string>

    abstract processEvent(page: any): Promise<EventFields>;


    getUrl(page: any): string {
        return page.url();
    }



    async saveEvent(event: EventFields): Promise<void> {
        await this.request.post(`/events`, event);
    }

    async savePlace(place: PlaceFields) {
        const response = await this.request.post(`/places`, place);
        this.placeId = response.data.placeId
    }

    async getPlaceId() {
        const response = await this.request.get('/places'); // @TODO: Use a specific endpoint to filter by address or something
        const currentPlace = response.data.find((place: PlaceFields) => (place.address == this.address));
        return currentPlace.id;
    }

    abstract fetchEvents(): Promise<void>;
}

export default Scraper;