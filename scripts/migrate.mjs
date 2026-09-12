import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS page_views (
    id SERIAL PRIMARY KEY,
    path TEXT NOT NULL,
    referrer TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views (created_at)
`;

await sql`
  ALTER TABLE page_views ADD COLUMN IF NOT EXISTS country TEXT
`;

await sql`
  CREATE INDEX IF NOT EXISTS page_views_country_idx ON page_views (country)
`;

await sql`
  ALTER TABLE page_views ADD COLUMN IF NOT EXISTS visitor_id TEXT
`;

await sql`
  CREATE INDEX IF NOT EXISTS page_views_visitor_id_idx ON page_views (visitor_id)
`;

await sql`
  CREATE TABLE IF NOT EXISTS click_events (
    id SERIAL PRIMARY KEY,
    path TEXT NOT NULL,
    visitor_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE INDEX IF NOT EXISTS click_events_created_at_idx ON click_events (created_at)
`;

await sql`
  CREATE TABLE IF NOT EXISTS contact_submissions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    type TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

console.log("Migration terminée : tables admin_users, page_views, click_events, contact_submissions prêtes.");
