import scrapers from "./scrapers/index.js";
import { ProviderRequest } from './providers/index.js'
import cookie from 'js-cookie';
import { URLS, AUTH_COOKIE} from './constants.js';


async function run() {

  try {
    console.log('Logging in the server...')
    const response = await ProviderRequest.post(URLS.LOGIN, {username: 'yarilo', password: 'salpica'});
    const {auth_token} = response;
    ProviderRequest.authenticate(auth_token);
  } catch (error) {
    console.log(`Error logging, ${error}`)
    return;
  }

  for (const scraper of scrapers) {
    const s = new scraper();
    try {
      await s.fetchEvents(); // @TODO: La Escalera de Jacob give timeouts sometimes, increase Playwright timeout config
    } catch (error) {
      console.log(`Error processing: ${s.name}`, error);
      continue;
    }
  }
}

run();
