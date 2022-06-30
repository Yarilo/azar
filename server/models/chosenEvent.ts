import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";
import BaseModel from "./baseModel.ts";
import Event from "./event.ts";

export type ChosenEventFields = {
  readonly id?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  eventId: any;
};

const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear();
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
    date: DataTypes.DATETIME,
  };

  static async add(chosenEventFields: ChosenEventFields) {
    return await this.create(chosenEventFields);
  }

  static async listToday(): Promise<Model[]> {
    const today = new Date().toISOString().split("T")[0];
    const todayAtMidnight = `${today}:T00:00:00.000Z`;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const eventsFromTodayAndAfter = await this.where(
      "createdAt",
      ">",
      todayAtMidnight,
    ).get() as Model[];

    // Cannot do multiple where clauses so we filter manually https://github.com/eveningkid/denodb/issues/197
    const todayEvents = eventsFromTodayAndAfter.filter((event: any) =>
      isToday(event.createdAt)
    );
    return todayEvents;
  }

  /* Relationships */

  static event() {
    return this.hasOne(Event);
  }
}

export default ChosenEvent;
