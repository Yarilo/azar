import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import logger from "https://deno.land/x/oak_logger/mod.ts";
import db from "./db.ts";
import { auth, events, places } from "./routes/index.ts";

const SERVER_PORT = 80;

const router = new Router();
router
  .get("/places", auth.validate, places.list)
  .post("/places", auth.validate, places.add);

router
  .get("/events", auth.validate, events.list)
  .get("/events/today", events.today)
  .post("/events", auth.validate, events.add);

router.post("/login", auth.login);

const app = new Application();

app.use(
  oakCors({
    origin: "http://localhost:8080",
  }),
);


app.use(logger.logger)
app.use(logger.responseTime)

app.use(router.routes());
app.use(router.allowedMethods());

// Serve client assets
app.use(async (context, next) => {
  try {
    await context.send({
      root: `${Deno.cwd()}/client/public`,
      index: "index.html",
    });
    next();
  } catch {
    next();
  }
});

await db.init();
await app.listen({ port: SERVER_PORT });
