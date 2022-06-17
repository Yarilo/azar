import scrapers from "./scrapers/index.js";

async function run() {
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
