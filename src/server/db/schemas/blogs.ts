import {
  pgTable,
  timestamp,
  varchar,
  pgEnum,
  uuid,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import {
  assetsImages,
  verifyAssetsImageSchema,
} from "~/server/db/schemas/assets-images";

export const blogStatusEnum = z.enum(["DRAFT", "PUBLISHED"]);
export const blogStatusValues = blogStatusEnum.Values;
export const blogStatusEnumSchema = pgEnum("blog_status", [
  "DRAFT",
  "PUBLISHED",
]);

export const blogs = pgTable("blogs", {
  id: uuid("id").primaryKey().defaultRandom(),
  _clerk: varchar("_clerk", { length: 32 }).notNull(),
  _image: uuid("_image")
    .notNull()
    .references(() => assetsImages.id),
  title: varchar("title").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  author_name: varchar("author_name").notNull(),
  author_bio: text("author_bio"),
  author_linkedin: varchar("author_linkedin"),
  author_avatar_url: varchar("author_avatar_url"),
  status: blogStatusEnumSchema("status").notNull(),
  published_at: timestamp("published_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const verifyBlogSchema = createInsertSchema(blogs)
  .omit({
    id: true,
    _clerk: true,
    _image: true,
    created_at: true,
    updated_at: true,
  })
  .extend({ verifyAssetsImageSchema: verifyAssetsImageSchema.optional() });

export const formBlogSchema = createInsertSchema(blogs).omit({
  id: true,
  _clerk: true,
  _image: true,
  created_at: true,
  updated_at: true,
});