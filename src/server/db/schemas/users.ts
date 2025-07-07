import { pgTable, timestamp, varchar, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const experienceSchema = z.object({
  company: z.string().nullable(),
  title: z.string().nullable(),
  employment_type: z
    .enum(["full-time", "part-time", "freelance", "internship"])
    .nullable(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  description: z.string().nullable(),
  skills_used: z.array(z.string()).default([]),
});
export type UserExperience = z.infer<typeof experienceSchema>;

export const educationSchema = z.object({
  institution: z.string().nullable(),
  degree: z.string().nullable(),
  field_of_study: z.string().nullable(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  gpa: z.string().nullable(),
  relevant_coursework: z.array(z.string()).default([]),
});
export type UserEducation = z.infer<typeof educationSchema>;

export const socialLinkSchema = z.object({
  platform: z.enum(["linkedin", "github", "portfolio", "website"]),
  url: z.string().url(),
});
export type UserSocialLink = z.infer<typeof socialLinkSchema>;

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  _clerk: varchar("_clerk", { length: 32 }).notNull().unique(),

  // Essential Info
  display_name: varchar("display_name", { length: 255 }),
  location: varchar("location", { length: 255 }),
  current_title: varchar("current_title", { length: 255 }),

  // Structured Career Data with proper typing
  experience: jsonb("experience").$type<UserExperience[]>().default([]),
  education: jsonb("education").$type<UserEducation[]>().default([]),

  // Skills (core matching criteria)
  skills: jsonb("skills").$type<string[]>().default([]),

  // Social Media Links
  social_links: jsonb("social_links").$type<UserSocialLink[]>().default([]),

  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;

export const userProfileSchema = createInsertSchema(users, {
  skills: z.array(z.string()).optional(),
  experience: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  social_links: z.array(socialLinkSchema).optional(),
}).omit({
  id: true,
  _clerk: true,
  created_at: true,
  updated_at: true,
});
