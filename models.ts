import { Model, DataTypes } from 'https://deno.land/x/denodb/mod.ts';

export type PlaceFields = {
  readonly id?: any,
  name: string,
  website: string,
  address:string,
} // @TODO: Infer it from below or something

class Place extends Model {
    static table = 'places';
    static timestamps = true;
    static fields:PlaceFields = {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: DataTypes.STRING,
      website: DataTypes.STRING,
      address: DataTypes.STRING
      // @TODO: Add fk to events
    }
  }


export { Place };