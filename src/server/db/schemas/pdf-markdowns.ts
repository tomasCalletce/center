import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { assetsMarkdown } from "~/server/db/schemas/asset-markdown";
import { assetsPdf } from "~/server/db/schemas/assets-pdf";

export const pdfMarkdowns = pgTable("pdf_markdowns", {
  id: uuid("id").primaryKey().defaultRandom(),
  _pdf_asset: uuid("_pdf_asset").references(() => assetsPdf.id),
  _markdown_asset: uuid("_markdown_asset").references(() => assetsMarkdown.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
