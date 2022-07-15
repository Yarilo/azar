import { timestamp } from "../utils/index.ts";

export const tableName = "chosen_events";
export interface columns {
  readonly id?: number; // Used  both PK and FK
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export const createTableQuery = (`
  ${timestamp.sqlFunction()}

  CREATE TABLE IF NOT EXISTS ${tableName}(
    id INTEGER PRIMARY KEY REFERENCES events,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
  ); 
  
  ${timestamp.trigger(tableName)}`);
