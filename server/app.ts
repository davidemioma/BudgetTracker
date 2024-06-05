import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { expensesRoute } from "./routes/expenses";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app.basePath("/api").route("/expenses", expensesRoute);

// Frontend. it's displays the client code if no API endpoint.
app.get("*", serveStatic({ root: "./client/dist" }));

app.get("*", serveStatic({ path: "./client/dist/indec.html" }));

export default app;

export type ApiRoutes = typeof apiRoutes;