import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";
import BaseModel from "./baseModel.ts";
import Event from "./event.ts";

export type ChosenEventFields = {
  readonly id?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  eventId: any;
  date: Date;
};

class ChosenEvent extends BaseModel {
  static table = "chosen_events";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: DataTypes.DATE,
  };

  static async add(chosenEventFields: ChosenEventFields) {
    return await this.create(chosenEventFields);
  }

  /* Relationships */

  static event() {
    return this.hasOne(Event);
  }
}

export default ChosenEvent;
