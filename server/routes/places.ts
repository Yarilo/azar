import { Place } from "../models/index.ts";
import { PlaceFields } from "../models/place.ts";

export default {
  add: async (context: any) => {
    const fields: PlaceFields = await context.request.body({ type: "json" })
      .value;
    const newPlace = await Place.add(fields);
    context.response.body = newPlace;
  },
  list: async (context: any) => {
    const places = await Place.list();
    context.response.body = JSON.stringify(places);
  },
};
