import { Model, DataTypes } from 'https://deno.land/x/denodb/mod.ts';

class Place extends Model {
    static table = 'places';
    static timestamps = true;
    static fields = {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      website: DataTypes.STRING,
      address: DataTypes.STRING
      // @TODO: Add fk to events
    }
  }

export { Place };