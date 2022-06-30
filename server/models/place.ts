import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";
import BaseModel from "./baseModel.ts";
import Event from "./event.ts";

export type PlaceFields = {
  readonly id?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  name: string;
  website: string;
  address: string;
};

class Place extends BaseModel {
  static table = "places";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    website: {
      type: DataTypes.STRING,
      unique: true,
    },
    address: DataTypes.STRING,
  };

  static async add(placeFields: PlaceFields) {
    return await this.create(placeFields);
  }

  static async edit(id: string, fields: PlaceFields): Promise<Model> {
    await this.where("id", id).update({
      ...fields,
    });
    return this.find(id);
  }

  /* Relationships */

  static events() {
    return this.hasMany(Event);
  }
}

export default Place;
