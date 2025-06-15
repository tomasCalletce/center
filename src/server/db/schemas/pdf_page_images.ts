import { pgTable, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { assetsPdf } from "./assets-pdf";
import { assetsImages } from "./assets-images";

export const pdfPageImages = pgTable("pdf_page_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  _pdf_assets: uuid("_pdf_assets").references(() => assetsPdf.id),
  _image_asset: uuid("_image_asset").references(() => assetsImages.id),
  page_number: integer("page_number").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
