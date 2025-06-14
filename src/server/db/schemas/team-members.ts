import {
  pgTable,
  timestamp,
  varchar,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { teams } from "~/server/db/schemas/teams";

export const teamMemberRoleEnum = z.enum(["OWNER", "ADMIN", "MEMBER"]);
export const teamMemberRoleValues = teamMemberRoleEnum.Values;
export const teamMemberRoleEnumSchema = pgEnum("team_member_role", [
  "OWNER",
  "ADMIN",
  "MEMBER",
]);

export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  _team: uuid("_team")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  _user: varchar("_user", { length: 32 }).notNull(),
  role: teamMemberRoleEnumSchema("role").default("MEMBER").notNull(),
  joined_at: timestamp("joined_at").defaultNow().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const verifyTeamMembersSchema = createInsertSchema(teamMembers).omit({
  id: true,
  _user: true,
  joined_at: true,
  created_at: true,
  updated_at: true,
}); 