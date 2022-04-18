import { Database, PostgresConnector } from 'https://deno.land/x/denodb/mod.ts';
import { Place, Event } from './models/index.ts'
import { Relationships } from 'https://deno.land/x/denodb/mod.ts';



async function init () {


  const connector = new PostgresConnector({
    database: 'azar',
    host: 'localhost',
    username: 'azar',
    password: 'test',
    port: 5432, 
  });
  
  const db = new Database(connector);
  
  await Relationships.belongsTo(Event, Place);

  await db.link([Place, Event]);
  await db.sync({drop:true}); // @TODO: Drop true only useful while testing I guess?

 await Place.createPlace({name:'Placetest',website: 'http://test.com', address:'test, 1, 4'})

 await Event.createEvent({title:'test-event', description:'woss', date: new Date(), price:50, url: 'http://test.com', placeId:'1'});

 console.log('DB started!');

}



export default { init };