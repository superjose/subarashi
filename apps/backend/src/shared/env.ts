import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as schema from "../db/schema";

export interface Env {
  subarashi_db: D1Database;
  SUBARASHI_SUBS: R2Bucket;
}

export type Database = DrizzleD1Database<typeof schema>;
