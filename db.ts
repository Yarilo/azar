import { Database, PostgresConnector } from 'https://deno.land/x/denodb/mod.ts';
import { Place, PlaceFields } from './models.ts'


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
  await db.sync({drop:true}); // @TODO: Drop true only useful while testing I guess?

 await createPlace({name:'Placetest',website: 'http://test.com', address:'test, 1, 4'})
 console.log('DB started!');

}

async function createPlace (placeFields: PlaceFields){ 
  return Place.create(placeFields)
}

async function list (): Promise<any> { // @TODO: Correct type
  return Place.all() // @TODO: Return only necessary fields
}

export default {init, list};