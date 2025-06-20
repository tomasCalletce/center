import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { challenges } from "~/server/db/schemas/challenges";

export const participationIntents = pgTable("participation_intents", {
  id: uuid("id").primaryKey().defaultRandom(),
  _clerk: varchar("_clerk", { length: 32 }).notNull(),
  _challenge: uuid("_challenge")
    .notNull()
    .references(() => challenges.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const verifyParticipationIntentsSchema = createInsertSchema(
  participationIntents
).omit({
  id: true,
  _clerk: true,
  created_at: true,
  updated_at: true,
});
