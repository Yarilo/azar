import scrapers from './scrapers/index.js'

async function run() {
    for (const scraper of scrapers) {
        const s = new scraper();
        await s.fetchEvents();
    }
}


run();  