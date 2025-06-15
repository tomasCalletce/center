import { pgTable, timestamp, varchar, pgEnum, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { assets } from "~/server/db/schemas/asset";
import { verifyAssetsSchema } from "~/server/db/schemas/asset";

export const documentTypeEnum = z.enum(["CV"]);
export const documentTypeValues = documentTypeEnum.Values;
export const documentTypeEnumSchema = pgEnum("document_type", ["CV"]);

export const assetsPdf = pgTable("pdf_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  _clerk: varchar("_user", { length: 32 }).notNull(),
  _asset: uuid("_asset").references(() => assets.id),
  type: documentTypeEnumSchema("type").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const verifyAssetsPdfSchema = createInsertSchema(assetsPdf)
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
