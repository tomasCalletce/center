import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { assets } from "~/server/db/schemas/asset";
import {
  formAssetsSchema,
  verifyAssetsSchema,
} from "~/server/db/schemas/asset";

export const assetsImages = pgTable("assets_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  _clerk: varchar("_user", { length: 32 }).notNull(),
  _asset: uuid("_asset").references(() => assets.id),
  alt: varchar("alt", { length: 500 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const verifyAssetsImageSchema = createInsertSchema(assetsImages)
  .omit({
    id: true,
    _clerk: true,
    _asset: true,
    created_at: true,
    updated_at: true,
  })
  .extend({
    verifyAssetsSchema,
  });

export const formAssetsImageSchema = createInsertSchema(assetsImages)
  .omit({
    id: true,
    _clerk: true,
    _asset: true,
    created_at: true,
    updated_at: true,
  })
  .extend({ formAssetsSchema });
