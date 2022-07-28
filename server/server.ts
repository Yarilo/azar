import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import logger from "https://deno.land/x/oak_logger/mod.ts";
import { ProviderDB } from "./providers/index.ts";
import { auth, events, places } from "./routes/index.ts";
import { initializeDatabase } from './utils';

const SERVER_PORT = 80;

const router = new Router({ prefix: "/api" });
router
  .get("/places", auth.validate, places.list)
  .post("/places", auth.validate, places.add);

router
  .get("/events", auth.validate, events.list)
  .get("/events/today", events.today)
  .post("/events", auth.validate, events.add);

router.post("/login", auth.login);

const app = new Application();

app.use(oakCors());

app.use(logger.logger);
app.use(logger.responseTime);

app.use(router.routes());
app.use(router.allowedMethods());

// Serve client assets
app.use(async (context, next) => {
  const { pathname } = context.request.url;
  const path = pathname.includes("build") || pathname.includes("css")
    ? pathname
    : "/"; // @TODO: UGLY as big as my head, review
  try {
    await context.send({
      root: `${Deno.cwd()}/client/public`,
      index: "index.html",
      path,
    });
    next();
  } catch (error) {
    console.log("error", error);
    next();
  }
});

await ProviderDB.connect();
await initializeDatabase();
await app.listen({ port: SERVER_PORT });
