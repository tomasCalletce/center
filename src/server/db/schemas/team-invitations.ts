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
import { teams } from "~/server/db/schemas/teams";

export const teamInvitationStatusEnum = z.enum([
  "PENDING",
  "ACCEPTED",
  "DECLINED",
  "EXPIRED",
]);
export const teamInvitationStatusValues = teamInvitationStatusEnum.Values;
export const teamInvitationStatusEnumSchema = pgEnum("team_invitation_status", [
  "PENDING",
  "ACCEPTED",
  "DECLINED",
  "EXPIRED",
]);

export const teamInvitations = pgTable("team_invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  _team: uuid("_team")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  _inviter: varchar("_inviter", { length: 32 }).notNull(),
  _invitee: varchar("_invitee", { length: 32 }).notNull(),
  message: text("message"),
  status: teamInvitationStatusEnumSchema("status").default("PENDING").notNull(),
  expires_at: timestamp("expires_at").notNull(),
  responded_at: timestamp("responded_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const verifyTeamInvitationsSchema = createInsertSchema(teamInvitations).omit({
  id: true,
  _inviter: true,
  status: true,
  responded_at: true,
  created_at: true,
  updated_at: true,
}); 