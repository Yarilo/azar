import { timestamp } from "../utils/index.ts";

export const tableName = "users";
export interface columns {
  readonly id?: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  username: string;
  password: string;
}

export const createTableQuery = `
  ${timestamp.sqlFunction()}

  CREATE TABLE IF NOT EXISTS ${tableName}(
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
  );

  ${timestamp.trigger(tableName)}`;
