import { Status } from "https://deno.land/x/oak/mod.ts";
import { Place } from "../models/index.ts";
import { ProviderDB } from "../providers/index.ts";

const UNIQUE_VIOLATION_ERROR = "23505";

export default {
  add: async (context: any) => {
    const fields: Place.columns = await context.request.body({ type: "json" })
      .value;
    try {
      await ProviderDB.insert(Place.tableName, fields);
      context.response.status = Status.OK;
    } catch (error) {
      if (error?.fields.code === UNIQUE_VIOLATION_ERROR) {
        context.response.status = Status.Conflict; // Duplicated resource
      } else {
        context.response.status = Status.InternalServerError;
        console.error(`Error adding an event, ${error}`);
      }
    }
  },
  list: async (context: any) => {
    const places = await ProviderDB.find(
      Place.tableName,
      "*",
    ) as Place.columns[];
    context.response.body = JSON.stringify(places);
  },
};
