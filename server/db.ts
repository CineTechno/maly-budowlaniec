
import { drizzle } from 'drizzle-orm/better-sqlite3';
import ws from "ws";
import * as schema from "@shared/schema";
import Database from 'better-sqlite3';

const sqlite = new Database('local.db')

// if (!process.env.DATABASE_URL) {
//   throw new Error(
//     "DATABASE_URL must be set. Did you forget to provision a database?",
//   );
// }
export const db = drizzle( sqlite, {schema} );
