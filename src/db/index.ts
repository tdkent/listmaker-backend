import { Pool } from "pg";

import { devDb } from "../config/config";

const connectionString = process.env.DATABASE_URL || devDb;

const db = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
});

export default db;
