import { schemaTask } from "@trigger.dev/sdk/v3";
import { generateObject } from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { db } from "~/server/db/connection";
import {
  educationSchema,
  experienceSchema,
  socialLinkSchema,
  users,
} from "~/server/db/schemas/users";
import { clerkClient } from "@clerk/nextjs/server";
import { ONBOARDING_STATUS } from "~/types/onboarding";

const userProfileSchema = z.object({
  display_name: z.string().nullable(),
  email: z.string().email().nullable(),
  location: z.string().nullable(),
  current_title: z.string().nullable(),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(z.string()).default([]),
  social_links: z.array(socialLinkSchema).default([]),
});

export const extractJsonStructureTask = schemaTask({
  id: "onboarding.extract-json-structure",
  schema: z.object({
    markdown: z.object({
      content: z.string(),
    }),
    userId: z.string(),
  }),
  run: async ({ markdown, userId }) => {
    const prompt = `
      Extract key profile information from the following resume/CV document.
      
      Focus on extracting only these essential details:
      - Display name: Extract a professional title or role description (e.g., "Frontend Developer in React", "Senior Software Engineer", "Full Stack Developer") NOT the person's actual name
      - Location (city, state/country)
      - Current job title (most recent or current position)
      
      Work Experience (extract as structured array):
      - Company name
      - Job title/position
      - Employment type: full-time, part-time, contract, freelance, internship, volunteer
      - Start date (YYYY-MM format, or just YYYY if month unknown)
      - End date (YYYY-MM format, or "present" if current, or just YYYY if month unknown)
      - Brief description of role/responsibilities
      - Skills/technologies used in that role
      
      Education (extract as structured array):
      - Institution name
      - Degree type (Bachelor's, Master's, PhD, Certificate, etc.)
      - Field of study/major
      - Start date (YYYY format)
      - End date (YYYY format or "present" if ongoing)
      - GPA (if mentioned)
      - Relevant coursework (if mentioned)
      
      Guidelines:
      - Extract ALL work experiences and education entries, even short-term ones
      - Use "present" for end dates of current positions/studies
      - If information is unclear or missing, set field to null
      - Extract comprehensive skills from throughout the document
      - For current_title, use the most recent job title or current position
      - For display_name, create a professional title based on their experience and skills (e.g., "React Frontend Developer", "Python Backend Engineer", "Full Stack Developer")
      
      Document content:
      ${markdown.content}
    `;

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      prompt,
      schema: userProfileSchema,
      temperature: 0.1,
    });

    const userData = {
      _clerk: userId,
      display_name: object.current_title,
      location: object.location,
      current_title: object.current_title,
      experience: object.experience,
      education: object.education,
      skills: object.skills,
      social_links: object.social_links,
    };

    const [updatedUser] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users._clerk,
        set: {
          display_name: userData.display_name,
          location: userData.location,
          current_title: userData.current_title,
          experience: userData.experience,
          education: userData.education,
          skills: userData.skills,
          social_links: userData.social_links,
        },
      })
      .returning({
        id: users.id,
      });
    if (!updatedUser) {
      throw new Error("Failed to upsert user");
    }

    return {
      userId: updatedUser.id,
    };
  },
});
