import { timestamp } from "../utils/index.ts";

export const tableName = "events";
export interface columns {
  readonly id?: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  title: string;
  description: string;
  price: number; // This may be a string because there could be an "early" and "on site" price...either that or add another field
  date: Date;
  url: string;
  place_id: number;
}

export const createTableQuery = `
  ${timestamp.sqlFunction()}
 
  CREATE TABLE IF NOT EXISTS ${tableName}(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    url TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    place_id INTEGER NOT NULL,
    CONSTRAINT fk_place FOREIGN KEY(place_id) REFERENCES places
  );
  
  ${timestamp.trigger(tableName)}`;

// @TODO: Relationships
