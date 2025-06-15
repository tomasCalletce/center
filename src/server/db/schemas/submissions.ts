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
import { challenges } from "~/server/db/schemas/challenges";
import { teams } from "~/server/db/schemas/teams";
import {
  assetsImages,
  formImagesSchema,
  verifyImagesSchema,
} from "~/server/db/schemas/assets-images";

export const submissionVisibilityEnum = z.enum(["VISIBLE", "HIDDEN"]);
export const submissionVisibilityValues = submissionVisibilityEnum.Values;
export const submissionVisibilityEnumSchema = pgEnum("submission_visibility", [
  "VISIBLE",
  "HIDDEN",
]);

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  _team: uuid("_team")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  _challenge: uuid("_challenge").references(() => challenges.id),
  _logo_image: uuid("_logo_image").references(() => assetsImages.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  demo_url: text("demo_url").notNull(),
  repository_url: text("repository_url").notNull(),
  status: submissionVisibilityEnumSchema("status").notNull(),
  submitted_by: varchar("submitted_by", { length: 32 })
    .notNull()
    .default("unknown"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const verifySubmissionsSchema = createInsertSchema(submissions)
  .omit({
    id: true,
    _team: true,
    _logo_image: true,
    submitted_by: true,
    created_at: true,
    updated_at: true,
  })
  .extend({
    verifyImagesSchema,
  });

export const formSubmissionSchema = createInsertSchema(submissions)
  .omit({
    id: true,
    _team: true,
    _challenge: true,
    _logo_image: true,
    demo_url: true,
    repository_url: true,
    submitted_by: true,
    created_at: true,
    updated_at: true,
  })
  .extend({
    formImagesSchema,
    demo_url: z.string().url(),
    repository_url: z.string().url(),
  });
