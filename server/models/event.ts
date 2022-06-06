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
  url: string; // @TODO: Make it unique!
  placeId: string;
  // @TODO: Images
};

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
    date: DataTypes.DATE,
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

  /* Relationships */

  static place() {
    return this.hasOne(Place);
  }
}

export default Event;
