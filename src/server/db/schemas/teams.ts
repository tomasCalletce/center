import {
  pgTable,
  timestamp,
  varchar,
  uuid,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  _owner: varchar("_owner", { length: 32 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  max_members: integer("max_members").default(5).notNull(),
  is_public: boolean("is_public").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const verifyTeamsSchema = createInsertSchema(teams).omit({
  id: true,
  _owner: true,
  created_at: true,
  updated_at: true,
}); 