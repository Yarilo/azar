import {
  Model,
  DataTypes
} from 'https://deno.land/x/denodb/mod.ts';
import Place from './place.ts'

export type EventFields = {
  readonly id ? : string,
  readonly createdAt ? : Date;
  readonly updatedAt ? : Date;
  title: string,
  description: string,
  price: number,
  date: Date,
  url: string,
  placeId: string,
  // @TODO: Images
}

class Event extends Model {
  static table = 'events';
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
    date: DataTypes.DATE,
    // @TODO: Images
  }

  static async list() {
    return await this.all()
  }

  static async listTodayEvents() {
    return await this.where('datepart()',,'1').
  }


  static async findById(id: string): Promise < Model > {
    return await this.find(id);
  }

  static async add(eventFields: EventFields) {
    return await this.create(eventFields)
  }

  static async edit(id: string, fields: EventFields): Promise < Model > {
    await this.where('id', id).update({
      ...fields
    });
    return this.find(id);
  }

  static async remove(id: string): Promise < Model | Model[] > {
    return await this.deleteById(id)
  }

 
  /* Relationships */

  static place() {
    return this.hasOne(Place);
  }
}


export default Event;