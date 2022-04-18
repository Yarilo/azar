import { Database, PostgresConnector } from 'https://deno.land/x/denodb/mod.ts';
import { Place } from './models/place.ts'


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

 await Place.createPlace({name:'Placetest',website: 'http://test.com', address:'test, 1, 4'})
 console.log('DB started!');

}



export default { init };