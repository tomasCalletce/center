import { pgTable, timestamp, varchar, pgEnum, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const assetContentTypeEnum = z.enum(["image/jpeg"]);
export const assetContentTypeValues = assetContentTypeEnum.Values;
export const assetContentTypeEnumSchema = pgEnum("content_type", [
  "image/jpeg",
]);

export const assets = pgTable("assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  _clerk: varchar("_user", { length: 32 }).notNull(),
  pathname: varchar("pathname", { length: 255 }).notNull(),
  content_type: assetContentTypeEnumSchema("content_type").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const verifyAssetsSchema = createInsertSchema(assets).omit({
  id: true,
  _clerk: true,
  created_at: true,
  updated_at: true,
});
