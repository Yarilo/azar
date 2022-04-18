import {
  Model,
  DataTypes
} from 'https://deno.land/x/denodb/mod.ts';

export type PlaceFields = {
  readonly id ? : any,
  readonly createdAt ? : string; // Correct type?
  readonly updatedAt ? : string;
  name: string,
  website: string,
  address: string,
} // @TODO: Infer it from below or something

class Place extends Model {
  static table = 'places';
  static timestamps = true;
  static fields: PlaceFields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    website: DataTypes.STRING,
    address: DataTypes.STRING
    // @TODO: Add fk to events
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

}


export {
  Place
};