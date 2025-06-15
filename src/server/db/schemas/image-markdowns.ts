import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { assetsImages } from "~/server/db/schemas/assets-images";
import { assetsMarkdown } from "~/server/db/schemas/asset-markdown";

export const imageMarkdowns = pgTable("image_markdowns", {
  id: uuid("id").primaryKey().defaultRandom(),
  _image_asset: uuid("_image_asset").references(() => assetsImages.id),
  _markdown_asset: uuid("_markdown_asset").references(() => assetsMarkdown.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
