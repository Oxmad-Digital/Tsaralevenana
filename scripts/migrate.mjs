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

await sql`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`
  INSERT INTO settings (key, value) VALUES
    ('maintenance_enabled', 'false'),
    ('maintenance_message', '')
  ON CONFLICT (key) DO NOTHING
`;

// Roles and invitations. Existing accounts become admins; new accounts default to member.
// Sent as one transaction: the neon() HTTP driver cannot hold BEGIN/COMMIT across calls.
await sql.transaction([
  sql`
    ALTER TABLE admin_users
      ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin'
      CHECK (role IN ('admin', 'member'))
  `,
  sql`ALTER TABLE admin_users ALTER COLUMN role SET DEFAULT 'member'`,
  sql`ALTER TABLE admin_users ALTER COLUMN password_hash DROP NOT NULL`,
  sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS invitation_token_hash TEXT`,
  sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS invitation_expires_at TIMESTAMPTZ`,
  sql`
    CREATE UNIQUE INDEX IF NOT EXISTS admin_users_invitation_token_hash_idx
      ON admin_users (invitation_token_hash)
      WHERE invitation_token_hash IS NOT NULL
  `,
]);

console.log("Migration terminée : tables admin_users (rôles, invitations), page_views, click_events, contact_submissions, settings prêtes.");
