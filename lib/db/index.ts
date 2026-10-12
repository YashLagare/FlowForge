import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

function cleanDatabaseUrl(raw?: string): string {
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }
  let url = raw.trim();
  // Strip surrounding quotes if present (single or double)
  if (
    (url.startsWith('"') && url.endsWith('"')) ||
    (url.startsWith("'") && url.endsWith("'"))
  ) {
    url = url.slice(1, -1).trim();
  }
  // Strip accidental "DATABASE_URL=" prefix if pasted into env value field
  if (url.startsWith("DATABASE_URL=")) {
    url = url.slice("DATABASE_URL=".length).trim();
  }
  // Strip quotes again in case it was DATABASE_URL="..."
  if (
    (url.startsWith('"') && url.endsWith('"')) ||
    (url.startsWith("'") && url.endsWith("'"))
  ) {
    url = url.slice(1, -1).trim();
  }
  return url;
}

// Pooled HTTP connection — safe for serverless/edge and Next.js Server Components.
const sql = neon(cleanDatabaseUrl(process.env.DATABASE_URL));

export const db = drizzle({ client: sql, schema, casing: "snake_case" });

export { schema };

