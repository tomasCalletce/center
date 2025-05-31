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
import { images } from "~/server/db/schemas/images";

export const submissionVisibilityEnum = z.enum(["VISIBLE", "HIDDEN"]);
export const submissionVisibilityValues = submissionVisibilityEnum.Values;
export const submissionVisibilityEnumSchema = pgEnum("submission_visibility", [
  "VISIBLE",
  "HIDDEN",
]);

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  _clerk: varchar("_user", { length: 32 }).notNull(),
  _challenge: uuid("_challenge").references(() => challenges.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  _logo_image: uuid("_logo_image").references(() => images.id),
  status: submissionVisibilityEnumSchema("status").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const verifySubmissionsSchema = createInsertSchema(submissions).omit({
  id: true,
  _clerk: true,
  created_at: true,
  updated_at: true,
});

export const formSubmissionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  _logo_image: z.string().min(1, "Logo image is required"),
});
