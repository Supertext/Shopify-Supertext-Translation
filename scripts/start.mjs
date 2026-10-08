// Production start (Railway): make sure the app's own database exists on the
// shared Postgres server, apply migrations, then start the server.
//
// DATABASE_URL points at the server (any database on it); SHOPIFY_DB_NAME
// (default "shopify_supertext") is the database this app uses there.
import { spawnSync } from "node:child_process";
import pg from "pg";

const base = process.env.DATABASE_URL;
if (!base) {
  console.error("[supertext] DATABASE_URL is not set.");
  process.exit(1);
}
const name = process.env.SHOPIFY_DB_NAME || "shopify_supertext";
if (!/^[a-z0-9_]+$/.test(name)) {
  console.error("[supertext] SHOPIFY_DB_NAME may only contain a-z, 0-9 and _.");
  process.exit(1);
}

const url = new URL(base);
const client = new pg.Client({ connectionString: base });
await client.connect();
const { rowCount } = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [name]);
if (!rowCount) {
  await client.query(`CREATE DATABASE "${name}"`);
  console.log(`[supertext] created database ${name}`);
}
await client.end();

url.pathname = `/${name}`;
const env = { ...process.env, DATABASE_URL: url.toString() };
const run = (cmd, args) => {
  const result = spawnSync(cmd, args, { stdio: "inherit", env });
  if (result.status !== 0) process.exit(result.status ?? 1);
};
run("npx", ["prisma", "migrate", "deploy"]);
run("npx", ["react-router-serve", "./build/server/index.js"]);
