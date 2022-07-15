import { Status } from "https://deno.land/x/oak/mod.ts";
import { Place } from "../models/index.ts";
import { ProviderDB } from "../providers/index.ts";

export default {
  add: async (context: any) => {
    const fields: Place.columns = await context.request.body({ type: "json" })
      .value;
    await ProviderDB.insert(Place.tableName, fields);
    context.response.status = Status.OK;
  },
  list: async (context: any) => {
    const places = await ProviderDB.find(
      Place.tableName,
      "*",
    ) as Place.columns[];
    context.response.body = JSON.stringify(places);
  },
};
