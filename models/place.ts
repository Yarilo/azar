import {
  Model,
  DataTypes
} from 'https://deno.land/x/denodb/mod.ts';
import Event from './event.ts'

export type PlaceFields = {
  readonly id ? : string,
  readonly createdAt ? : Date;
  readonly updatedAt ? : Date;
  name: string,
  website: string,
  address: string,
}

class Place extends Model {
  static table = 'places';
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    website: DataTypes.STRING,
    address: DataTypes.STRING
  }

  static async list() {
    return await this.all()
  }

  static async findById(id: string): Promise < Model > {
    return await this.find(id);
  }

  static async createPlace(placeFields: PlaceFields) {
    return await this.create(placeFields)
  }

  static async updatePlace(id: string, fields: PlaceFields): Promise < Model > {
    await this.where('id', id).update({
      ...fields
    });
    return this.find(id);
  }

  static async deletePlace(id: string): Promise < Model | Model[] > {
    return await Place.deleteById(id)
  }

  /* Relationships */

   static events() {
    return this.hasMany(Event);
  }
}


export default Place;