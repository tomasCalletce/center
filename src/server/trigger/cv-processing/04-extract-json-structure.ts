import { schemaTask } from "@trigger.dev/sdk/v3";
import { generateObject } from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";

const userProfileSchema = z.object({
  // Basic Information
  display_name: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),

  // Social & Web Presence
  github_username: z.string().optional(),
  linkedin_url: z.string().url().optional(),
  website_url: z.string().url().optional(),
  portfolio_url: z.string().url().optional(),

  // Employment & Career
  current_title: z.string().optional(),
  current_company: z.string().optional(),
  industry: z.string().optional(),
  experience_level: z.string().optional(),
  years_of_experience: z.number().optional(),
  employment_status: z.string().optional(),
  available_for_hire: z.boolean().optional(),

  // Job Preferences
  job_seeking_status: z.boolean().optional(),
  salary_expectation_min: z.number().optional(),
  salary_expectation_max: z.number().optional(),
  salary_currency: z.string().default("USD"),
  work_preferences: z.array(z.string()).default([]),
  preferred_locations: z.array(z.string()).default([]),
  willing_to_relocate: z.boolean().optional(),

  // Skills & Expertise
  skills: z.array(z.string()).default([]),
  programming_languages: z.array(z.string()).default([]),
  frameworks: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  soft_skills: z.array(z.string()).default([]),

  // Education
  education: z
    .array(
      z.object({
        institution: z.string().optional(),
        degree: z.string().optional(),
        field: z.string().optional(),
        graduation_year: z.string().optional(),
      })
    )
    .default([]),
  certifications: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),

  // Projects & Achievements
  notable_projects: z
    .array(
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        technologies: z.array(z.string()).default([]),
        url: z.string().url().optional(),
      })
    )
    .default([]),
  awards: z.array(z.string()).default([]),

  // Career Goals
  career_goals: z.string().optional(),
  ideal_role: z.string().optional(),
});

export const extractJsonStructureTask = schemaTask({
  id: "onboarding.extract-json-structure",
  schema: z.object({
    markdown: z.object({
      content: z.string(),
    }),
  }),
  run: async ({ markdown }) => {
    const prompt = `
      Extract comprehensive profile information from the following resume/CV document.
      
      Focus on extracting:
      - Personal details (name, contact info, location)
      - Professional experience and current role
      - Skills (technical and soft skills)
      - Education and certifications
      - Notable projects and achievements
      - Career preferences and goals
      
      For missing information, omit the field rather than making assumptions.
      Extract multiple items for arrays when available.
      
      Document content:
      ${markdown.content}
    `;

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      prompt,
      schema: userProfileSchema,
      temperature: 0.1,
    });

    return {
      extracted: object,
    };
  },
});
