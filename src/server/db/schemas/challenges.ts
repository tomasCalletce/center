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

export const visibilityStatusEnum = z.enum(["HIDDEN", "VISIBLE"]);
export const visibilityStatusValues = visibilityStatusEnum.Values;
export const visibilityStatusEnumSchema = pgEnum("visibility_status", [
  "HIDDEN",
  "VISIBLE",
]);

export const challenges = pgTable("challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  _clerk: varchar("_user", { length: 32 }).notNull(),
  _document: varchar("_document", { length: 32 }).notNull(),
  deadline: timestamp("deadline").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  details: text("details"),
  visibility_status: varchar("visibility_status", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const verifyChallengesSchema = createInsertSchema(challenges);
