import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  _clerk: varchar("_clerk", { length: 32 }).primaryKey().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const verifyUsersSchema = createInsertSchema(users);
export const formUsersSchema = createInsertSchema(users);
