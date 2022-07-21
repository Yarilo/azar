import scrapers from "./scrapers/index.js";
import { ProviderRequest } from './providers/index.js'
import { URLS } from './constants.js';


const { AZAR_USERNAME = '', AZAR_PASSWORD = '' } = process.env;

async function run() {

  if (!AZAR_USERNAME || !AZAR_PASSWORD) {
    throw new Error('Unable to obtain credentials from environment');
  }

  try {
    console.log('Logging in the server...')
    const response = await ProviderRequest.post(URLS.LOGIN, { username: AZAR_USERNAME, password: AZAR_PASSWORD });
    const { auth_token } = response;
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
  console.log('Finished processing events');
  process.exit(0);
}

run();
