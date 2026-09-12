import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL);

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("ADMIN_EMAIL et ADMIN_PASSWORD sont requis.");
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 12);

await sql`
  INSERT INTO admin_users (email, password_hash)
  VALUES (${email}, ${passwordHash})
  ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
`;

console.log(`Compte admin prêt pour ${email}.`);
