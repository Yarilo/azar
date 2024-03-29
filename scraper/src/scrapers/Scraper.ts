import type { EventFields, PlaceFields } from "../types/index.js";
import { ProviderRequest } from "../providers/index.js";
import { URLS } from "../constants.js";

const CONFLICT = 409;

abstract class Scraper {
  place_id: string;
  request: any;

  website: string;
  name: string;
  address: string;

  constructor() {
    this.place_id = "";
    this.website = "";
    this.name = "";
    this.address = "";
  }

  async init() {
    try {
      await this.savePlace({
        website: this.website,
        address: this.address,
        name: this.name,
      });
    } catch (error: any) {
      if (error.response?.status === CONFLICT) {
        console.log(`Place is already in db, ${error} `);
      } else {
        console.log(`Error saving the place, ${error} `);
      }

    }

    try {
      this.place_id = await this.getPlaceId(); // @TODO: This call is not needed if the one above succeeds
    } catch (error: any) {
      console.log(
        `Error initializating place id, ${error.statusMessage || error} `,
      );
    }
  }

  abstract getTitle(page: any): Promise<string>;

  abstract getDate(page: any): Promise<Date>;

  abstract getPrice(page: any): Promise<number>;

  abstract getDescription(page: any): Promise<string>;

  abstract processEvent(page: any): Promise<EventFields>;

  getUrl(page: any): string {
    return page.url();
  }

  async saveEvent(event: EventFields): Promise<void> {
    await ProviderRequest.post(URLS.EVENTS, event);
  }

  async savePlace(place: PlaceFields): Promise<void> {
    const savedPlace = await ProviderRequest.post(URLS.PLACES, place);
    this.place_id = savedPlace.place_id;
  }

  async getPlaceId(): Promise<string> {
    const places = await ProviderRequest.get(URLS.PLACES); // @TODO: Use a specific endpoint to filter by address or something
    const currentPlace = places.find((
      place: PlaceFields,
    ) => (place.address == this.address));
    return currentPlace.id;
  }

  abstract fetchEvents(): Promise<void>;
}

export default Scraper;
