import {
  pgTable,
  timestamp,
  varchar,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  jsonb,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const employmentStatusEnum = z.enum([
  "EMPLOYED",
  "UNEMPLOYED",
  "FREELANCER",
  "STUDENT",
  "LOOKING",
]);
export const employmentStatusValues = employmentStatusEnum.Values;
export const employmentStatusEnumSchema = pgEnum("employment_status", [
  "EMPLOYED",
  "UNEMPLOYED",
  "FREELANCER",
  "STUDENT",
  "LOOKING",
]);

export const experienceLevelEnum = z.enum([
  "ENTRY",
  "JUNIOR",
  "MID",
  "SENIOR",
  "LEAD",
  "EXECUTIVE",
]);
export const experienceLevelValues = experienceLevelEnum.Values;
export const experienceLevelEnumSchema = pgEnum("experience_level", [
  "ENTRY",
  "JUNIOR",
  "MID",
  "SENIOR",
  "LEAD",
  "EXECUTIVE",
]);

export const workPreferenceEnum = z.enum([
  "REMOTE",
  "HYBRID",
  "ONSITE",
  "FLEXIBLE",
]);
export const workPreferenceValues = workPreferenceEnum.Values;
export const workPreferenceEnumSchema = pgEnum("work_preference", [
  "REMOTE",
  "HYBRID",
  "ONSITE",
  "FLEXIBLE",
]);

export const jobTypePreferenceEnum = z.enum([
  "FULLTIME",
  "PARTTIME",
  "CONTRACT",
  "FREELANCE",
  "INTERNSHIP",
]);
export const jobTypePreferenceValues = jobTypePreferenceEnum.Values;
export const jobTypePreferenceEnumSchema = pgEnum("job_type_preference", [
  "FULLTIME",
  "PARTTIME",
  "CONTRACT",
  "FREELANCE",
  "INTERNSHIP",
]);

export const companySizePreferenceEnum = z.enum([
  "STARTUP",
  "SMALL",
  "MEDIUM",
  "LARGE",
  "ENTERPRISE",
]);
export const companySizePreferenceValues = companySizePreferenceEnum.Values;
export const companySizePreferenceEnumSchema = pgEnum("company_size_preference", [
  "STARTUP",
  "SMALL",
  "MEDIUM",
  "LARGE",
  "ENTERPRISE",
]);

export const visaStatusEnum = z.enum([
  "CITIZEN",
  "PERMANENT_RESIDENT",
  "WORK_VISA",
  "STUDENT_VISA",
  "REQUIRES_SPONSORSHIP",
]);
export const visaStatusValues = visaStatusEnum.Values;
export const visaStatusEnumSchema = pgEnum("visa_status", [
  "CITIZEN",
  "PERMANENT_RESIDENT",
  "WORK_VISA",
  "STUDENT_VISA",
  "REQUIRES_SPONSORSHIP",
]);

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  _user: varchar("_user", { length: 32 }).notNull().unique(),
  display_name: varchar("display_name", { length: 255 }).notNull(),
  bio: text("bio"),
  avatar_url: text("avatar_url"),
  
  // Contact & Social
  github_username: varchar("github_username", { length: 255 }),
  linkedin_url: text("linkedin_url"),
  twitter_url: text("twitter_url"),
  website_url: text("website_url"),
  portfolio_url: text("portfolio_url"),
  
  // Location & Availability
  location: varchar("location", { length: 255 }),
  timezone: varchar("timezone", { length: 100 }),
  employment_status: employmentStatusEnumSchema("employment_status"),
  available_for_hire: boolean("available_for_hire").default(false).notNull(),
  
  // Professional Info
  current_title: varchar("current_title", { length: 255 }),
  current_company: varchar("current_company", { length: 255 }),
  industry: varchar("industry", { length: 255 }),
  experience_level: experienceLevelEnumSchema("experience_level"),
  years_of_experience: integer("years_of_experience"),
  hourly_rate: integer("hourly_rate"),
  
  // Job Search Preferences
  job_seeking_status: boolean("job_seeking_status").default(false).notNull(),
  job_type_preferences: jsonb("job_type_preferences"),
  work_preferences: jsonb("work_preferences"),
  company_size_pref: jsonb("company_size_pref"),
  preferred_industries: jsonb("preferred_industries"),
  
  // Compensation & Benefits
  salary_expectation_min: integer("salary_expectation_min"),
  salary_expectation_max: integer("salary_expectation_max"),
  salary_currency: varchar("salary_currency", { length: 3 }).default("USD"),
  equity_interest: boolean("equity_interest").default(false),
  benefits_priorities: jsonb("benefits_priorities"),
  
  // Availability & Logistics
  availability_date: date("availability_date"),
  notice_period_weeks: integer("notice_period_weeks").default(2),
  willing_to_relocate: boolean("willing_to_relocate").default(false),
  preferred_locations: jsonb("preferred_locations"),
  visa_status: visaStatusEnumSchema("visa_status"),
  security_clearance: varchar("security_clearance", { length: 255 }),
  
  // Career Goals & Preferences
  career_goals: text("career_goals"),
  ideal_role: text("ideal_role"),
  deal_breakers: jsonb("deal_breakers"),
  motivations: jsonb("motivations"),
  
  // Skills & Expertise
  skills: jsonb("skills"),
  programming_languages: jsonb("programming_languages"),
  frameworks: jsonb("frameworks"),
  tools: jsonb("tools"),
  specializations: jsonb("specializations"),
  soft_skills: jsonb("soft_skills"),
  
  // Education & Certifications
  education: jsonb("education"),
  certifications: jsonb("certifications"),
  languages: jsonb("languages"),
  
  // CV Storage
  cv_markdown: text("cv_markdown"),
  cv_last_updated: timestamp("cv_last_updated"),
  
  // Achievements & Projects
  awards: jsonb("awards"),
  notable_projects: jsonb("notable_projects"),
  work_samples: jsonb("work_samples"),
  references: jsonb("references"),
  
  // Performance & Metrics
  github_stats: jsonb("github_stats"),
  stackoverflow_rep: integer("stackoverflow_rep"),
  hackathon_wins: integer("hackathon_wins").default(0),
  open_source_contrib: jsonb("open_source_contrib"),
  
  // Preferences
  preferred_team_size: integer("preferred_team_size").default(5),
  preferred_roles: jsonb("preferred_roles"),
  hackathon_experience: integer("hackathon_experience").default(0),
  
  // Privacy & Recruiting Settings
  is_public: boolean("is_public").default(true).notNull(),
  is_searchable: boolean("is_searchable").default(true).notNull(),
  open_to_recruiters: boolean("open_to_recruiters").default(false).notNull(),
  show_salary_info: boolean("show_salary_info").default(false).notNull(),
  
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const verifyUserProfilesSchema = createInsertSchema(userProfiles).omit({
  id: true,
  _user: true,
  created_at: true,
  updated_at: true,
}); 