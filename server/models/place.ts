import { timestamp } from "../utils/index.ts";

export const tableName = "places";
export interface columns {
  readonly id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  website: string;
  address: string;
}

export const createTableQuery = (`
  ${timestamp.sqlFunction()}

  CREATE TABLE IF NOT EXISTS ${tableName}(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    website VARCHAR(200) UNIQUE NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
  );

  ${timestamp.trigger(tableName)}`);

// @TODO: Relationships
