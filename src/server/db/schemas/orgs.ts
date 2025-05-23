import { pgTable, timestamp, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const orgs = pgTable("orgs", {
  _clerk: varchar("_clerk", { length: 32 }).primaryKey().notNull(),
  name: text("name").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const verifyOrgsSchema = createInsertSchema(orgs);

export const formOrgsSchema = createInsertSchema(orgs).omit({
  _clerk: true,
  created_at: true,
  updated_at: true,
});
