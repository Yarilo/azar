import {
  Client,
  ClientOptions,
} from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { ChosenEvent, Event, Place, User } from "../models/index.ts";
import { timestamp } from "../utils/index.ts";

type AllowedColumns =
  | Place.columns
  | Event.columns
  | ChosenEvent.columns
  | User.columns;

type ColumnNames =
  | keyof Place.columns
  | keyof Event.columns
  | keyof ChosenEvent.columns
  | keyof User.columns;

type AllowedTables = // @TODO: Move to a "types" folder
  | typeof Place.tableName
  | typeof Event.tableName
  | typeof ChosenEvent.tableName
  | typeof User.tableName;

const getDBConfig = (): ClientOptions => {
  const dbConfig: ClientOptions = {
    database: Deno.env.get("AZAR_DB_NAME"),
    hostname: Deno.env.get("AZAR_DB_HOST"),
    user: Deno.env.get("AZAR_DB_USERNAME"),
    password: Deno.env.get("AZAR_DB_PASSWORD"),
    port: Number(Deno.env.get("AZAR_DB_PORT")),
  };
  Object.entries(dbConfig).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`Error getting db config, no value found for: ${key}`);
    }
  });
  return dbConfig;
};

let client: Client;

export default {
  connect: async () => {
    const config = getDBConfig();
    client = new Client(config);
    await client.connect();
    console.log("DB connected!");
  },
  runQuery: async (query: string) => {
    await client.queryObject(query);
  },
  insert: async (tableName: AllowedTables, fields: AllowedColumns) => {
    const columnNames = Object.keys(fields).join(",");
    const columnValues = Object.values(fields).map((value) => {
      if (typeof value === "string") return `'${value}'`;
      if (value instanceof Date) {
        return timestamp.dateToTimestamp(value);
      }
      return value;
    }).join(",");
    const result = await client.queryObject(
      `INSERT INTO ${tableName} (${columnNames}) VALUES(${columnValues})`,
    );
    return result;
  },

  find: async (
    tableName: AllowedTables,
    column: ColumnNames | "*",
    whereQuery = "",
  ) => {
    const result = await client.queryObject<AllowedColumns>(
      `SELECT ${column} FROM ${tableName} ${whereQuery ? whereQuery : ""};`,
    );
    return result.rows;
  },
};
