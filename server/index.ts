import app from "./app";

Bun.serve({
  // Port defaults to $BUN_PORT, $PORT, $NODE_PORT otherwise 3000
  // Hostname defaults to "0.0.0.0"
  fetch: app.fetch,
});

console.log("Server Running!");
