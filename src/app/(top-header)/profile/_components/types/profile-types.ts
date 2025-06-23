import { type EmploymentType } from "~/server/db/schemas/users";

export interface ExperienceItem {
  title?: string | null;
  company?: string | null;
  employment_type?: EmploymentType | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  skills_used?: string[] | null;
}

export interface EducationItem {
  institution?: string | null;
  degree?: string | null;
  field_of_study?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  gpa?: string | null;
}

export interface SocialLink {
  platform: "linkedin" | "github" | "portfolio" | "website";
  url: string;
}

export interface ProfileHeaderData {
  display_name?: string;
  location?: string;
  current_title?: string;
  social_links?: SocialLink[];
} 