import dns from "node:dns";
import { neon } from "@neondatabase/serverless";

// Some local networks have broken/blackhole IPv6 routes, which makes
// Node's fetch hang until timeout before falling back to IPv4. Prefer
// IPv4 outright to avoid stalling every DB query.
dns.setDefaultResultOrder("ipv4first");

const databaseUrl = process.env.DATABASE_URL as string;

export const sql = neon(databaseUrl);
