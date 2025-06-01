import { pgTable, timestamp, varchar, pgEnum, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const assets = pgTable("assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  _clerk: varchar("_user", { length: 32 }).notNull(),
  pathname: varchar("pathname", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const verifyAssetsSchema = createInsertSchema(assets).omit({
  id: true,
  _clerk: true,
  created_at: true,
  updated_at: true,
});

export const formAssetsSchema = createInsertSchema(assets).omit({
  id: true,
  _clerk: true,
  created_at: true,
  updated_at: true,
});
