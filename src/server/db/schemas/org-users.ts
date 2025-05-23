import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { orgs } from "~/server/db/schemas/orgs";
import { users } from "~/server/db/schemas/users";

export const orgUsers = pgTable("org_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  _org: varchar("org_id", { length: 32 }).references(() => orgs._clerk),
  _user: varchar("user_id", { length: 32 }).references(() => users._clerk),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const verifyOrgUsersSchema = createInsertSchema(orgUsers);
