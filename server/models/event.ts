import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";
import Place from "./place.ts";
import BaseModel from "./baseModel.ts";

// @TODO: To common type
// @TODO: To keep it simple, events only have the address of the place, but they could have different address (e.g. a place or a promoter creating events in different sites)
export type EventFields = {
  readonly id?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  title: string;
  description: string;
  price: number; // This may be a string because there could be an "early" and "on site" price...either that or add another field
  date: Date;
  url: string;
  placeId: string;
  // @TODO: Images
};


const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
}

class Event extends BaseModel {
  static table = "events";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.STRING,
      unique: true,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    date: DataTypes.DATETIME,
    // @TODO: Images
  };

  static async add(eventFields: EventFields) {
    return await this.create(eventFields);
  }

  static async edit(id: string, fields: EventFields): Promise<Model> {
    await this.where("id", id).update({
      ...fields,
    });
    return this.find(id);
  }

  static async listToday(): Promise<Model[]> {
    const today = new Date().toISOString().split("T")[0];
    const todayAtMidnight = `${today}:T00:00:00.000Z`;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const eventsFromTodayAndAfter = await this.where("date", ">",todayAtMidnight,
    ).get() as Model[];

    // Cannot do multiple where clauses so we filter manually https://github.com/eveningkid/denodb/issues/197
    const todayEvents = eventsFromTodayAndAfter.filter((event: any) => isToday(event.date));
    return todayEvents;
  }

  /* Relationships */

  static place() {
    return this.hasOne(Place);
  }
}

export default Event;
