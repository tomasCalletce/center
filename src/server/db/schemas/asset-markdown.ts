import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { assets } from "~/server/db/schemas/asset";

export const assetsMarkdown = pgTable("assets_markdown", {
  id: uuid("id").primaryKey().defaultRandom(),
  _clerk: varchar("_user", { length: 32 }).notNull(),
  _asset: uuid("_asset").references(() => assets.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
