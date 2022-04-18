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
  return await Place.create(placeFields)
}

async function listPlaces (): Promise<any> { // @TODO: Correct type
  return await Place.all()
}


async function findPlaceById (id: string): Promise<any> { // @TODO: Correct type
  return await Place.find(id);
}

async function updatePlace (id: string, fields: PlaceFields): Promise<any> { // @TODO: Correct type
   await Place.where('id', id).update({...fields});
   return findPlaceById(id);
}

async function deletePlace (id:string): Promise<any> { // @TODO: Correct type
  return await Place.deleteById(id) 
}

export default { init, listPlaces, createPlace, deletePlace, updatePlace, findPlaceById };