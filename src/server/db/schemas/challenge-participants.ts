import {
  pgTable,
  timestamp,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { challenges } from "~/server/db/schemas/challenges";
import { teams } from "~/server/db/schemas/teams";

export const challengeParticipationStatusEnum = z.enum([
  "REGISTERED",
  "ACTIVE",
  "WITHDRAWN",
]);
export const challengeParticipationStatusValues = challengeParticipationStatusEnum.Values;
export const challengeParticipationStatusEnumSchema = pgEnum("challenge_participation_status", [
  "REGISTERED",
  "ACTIVE",
  "WITHDRAWN",
]);

export const challengeParticipants = pgTable("challenge_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  _challenge: uuid("_challenge")
    .notNull()
    .references(() => challenges.id, { onDelete: "cascade" }),
  _team: uuid("_team")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  status: challengeParticipationStatusEnumSchema("status").default("REGISTERED").notNull(),
  registered_at: timestamp("registered_at").defaultNow().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const verifyChallengeParticipantsSchema = createInsertSchema(challengeParticipants).omit({
  id: true,
  status: true,
  registered_at: true,
  created_at: true,
  updated_at: true,
}); 