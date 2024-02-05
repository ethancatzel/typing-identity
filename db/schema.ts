import {
  char,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const raw_data = pgTable("raw_data", {
  id: uuid("id").defaultRandom().primaryKey(),
  first_name: varchar("first_name", { length: 20 }).notNull(),
  char: char("char", { length: 1 }).notNull(),
  timestamp: timestamp("timestamp", { mode: "string" }).notNull(),
});

export type RawData = typeof raw_data.$inferSelect;
export type NewRawData = Omit<typeof raw_data.$inferInsert, "id">;

export const leaderboard = pgTable("leaderboard", {
  id: uuid("id").defaultRandom().primaryKey(),
  first_name: varchar("first_name", { length: 20 }).notNull(),
  total: integer("total").notNull().default(0),
  count: integer("count").notNull().default(0),
});

export type Leaderboard = typeof leaderboard.$inferSelect;
