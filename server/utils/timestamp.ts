// @TODO: TableName type
export default {
  sqlFunction: () =>
    `CREATE OR REPLACE FUNCTION update_updated_at_timestamp() 
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW; 
    END;
    $$ language 'plpgsql';
    `,
  trigger: (tableName: string) =>
    `CREATE TRIGGER ${tableName}_updated_at BEFORE UPDATE ON ${tableName} FOR EACH ROW EXECUTE PROCEDURE  update_updated_at_timestamp(); `,
  dateToTimestamp: (date: Date | string) =>
    `to_timestamp(${new Date(date).getTime() / 1000.0})`,
};
