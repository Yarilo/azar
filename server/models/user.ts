import { DataTypes } from "https://deno.land/x/denodb/mod.ts";
import BaseModel from "./baseModel.ts";

export type UserFields = {
  readonly id?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  username: string;
  password: string;
};

class User extends BaseModel {
  static table = "user";
  static timestamps = true;
  static fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.TEXT,
  };

  static async add(userFields: UserFields) {
    return await this.create(userFields);
  }
}

export default User;
