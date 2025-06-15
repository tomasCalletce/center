import {
  pgTable,
  timestamp,
  varchar,
  pgEnum,
  uuid,
  integer,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { assetsImages } from "~/server/db/schemas/assets-images";

export const challengeVisibilityEnum = z.enum(["VISIBLE", "HIDDEN"]);
export const challengeVisibilityValues = challengeVisibilityEnum.Values;
export const challengeVisibilityEnumSchema = pgEnum("challenge_visibility", [
  "VISIBLE",
  "HIDDEN",
]);

export const challengePricePoolCurrencyEnum = z.enum(["USD"]);
export const challengePricePoolCurrencyValues =
  challengePricePoolCurrencyEnum.Values;
export const challengePricePoolCurrencyEnumSchema = pgEnum(
  "challenge_price_pool_currency",
  ["USD"]
);

export const challenges = pgTable("challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  _clerk: varchar("_user", { length: 32 }).notNull(),
  _image: uuid("_image")
    .notNull()
    .references(() => assetsImages.id),
  title: varchar("title", { length: 255 }).notNull(),
  markdown: text("markdown"),
  price_pool: integer("price_pool").notNull(),
  price_pool_currency: challengePricePoolCurrencyEnumSchema(
    "price_pool_currency"
  ).notNull(),
  visibility: challengeVisibilityEnumSchema("visibility").notNull(),
  deadline_at: timestamp("deadline"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const verifyChallengesSchema = createInsertSchema(challenges).omit({
  id: true,
  _clerk: true,
  created_at: true,
  updated_at: true,
});
