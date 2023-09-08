# Azar


Three random live experiences every day: [Azar](https://azar.deno.dev/) (currently not showing anything as the scrapper has been stopped).

## Description & Disclaimer

Toy project to learn about [Deno](https://deno.land/), showing three daily events from Madrid using info from scraped sources. 

As this was a quick prototype project, expect messy commit history, bugs & poor test coverage, among others (types can be greatly improved, for example).

## Overview

### UI/Client

Written in [Svelte](https://svelte.dev/), calls the backend to pull the chosen events for the current day.

### Backend

Implemented using Deno, receives a request from the client and:

1. If is the first one of the day, ["randomly"](https://github.com/Yarilo/azar/blob/main/server/routes/events.ts#L110) chooses three events and returns them.
2. Otherwise, returns the chosen events for the current day.

The events are stored in postgres (via [Supabase](https://supabase.com/)), using [deno-postgres](https://github.com/denodrivers/postgres) as a db driver.

### Scrapper

Runs daily via Github [actions](https://github.com/Yarilo/azar/actions/workflows/run_scraper.yml) and checks the site of every [datasource](https://github.com/Yarilo/azar/tree/main/scraper/src/scrapers),
using [playwright](https://playwright.dev/) to scrap site data.


