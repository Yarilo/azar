import { Database, PostgresConnector } from 'https://deno.land/x/denodb/mod.ts';
import { Place } from './models.ts'

async function init () {
  const connector = new PostgresConnector({
    database: 'azar',
    host: 'localhost',
    username: 'azar',
    password: 'test',
    port: 5432, 
  });
  
  const db = new Database(connector);
  
  await db.link([Place]);
  await db.sync({drop:true});  
  console.log('DB started!');
}

async function list (): Promise<any> {
  await Place.all()
}

export default {init, list};