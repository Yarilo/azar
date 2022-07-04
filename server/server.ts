import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import db from "./db.ts";
import { auth, events, places } from "./routes/index.ts";

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

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});
// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use(router.routes());
app.use(router.allowedMethods());

await db.init();
await app.listen({ port: 4242 });
