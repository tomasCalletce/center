import { schemaTask } from "@trigger.dev/sdk/v3";
import { generateObject } from "ai";
import { z } from "zod";
import { groq } from "@ai-sdk/groq";
import { db } from "~/server/db/connection";
import {
  educationSchema,
  experienceSchema,
  socialLinkSchema,
  users,
} from "~/server/db/schemas/users";

const userProfileSchema = z.object({
  display_name: z.string().nullable(),
  email: z.string().email().nullable(),
  location: z.string().nullable(),
  current_title: z.string().nullable(),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(z.string()).default([]),
  social_links: z.array(socialLinkSchema).default([]).catch([]),
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
      - Email: Extract the email address if present
      - Location (city, state/country)
      - Current job title (most recent or current position)
      
      Work Experience (extract as structured array):
      - Company name
      - Job title/position
      - Employment type: MUST be one of: "full-time", "part-time", "freelance", "internship" (map other types like "contract" to "freelance", "volunteer" to "internship")
      - Start date (YYYY-MM format, or just YYYY if month unknown)
      - End date (YYYY-MM format, or "present" if current, or just YYYY if month unknown)
      - Brief description of role/responsibilities
      - Skills/technologies used in that role (as array of strings)
      
      Education (extract as structured array):
      - Institution name
      - Degree type (Bachelor's, Master's, PhD, Certificate, etc.)
      - Field of study/major
      - Start date (YYYY format)
      - End date (YYYY format or "present" if ongoing)
      - GPA (if mentioned)
      - Relevant coursework (if mentioned, as array of strings)
      
      Skills: Extract all technical skills, programming languages, tools, and technologies mentioned throughout the document as an array of strings
      
      Social Links: Extract social media/professional links if present. For each link:
      - Platform must be one of: "linkedin", "github", "portfolio", "website"
      - URL must be a valid URL
      - If no social links are found, return empty array
      
      Guidelines:
      - Extract ALL work experiences and education entries, even short-term ones
      - Use "present" for end dates of current positions/studies
      - If information is unclear or missing, set field to null
      - For current_title, use the most recent job title or current position
      - For display_name, create a professional title based on their experience and skills (e.g., "React Frontend Developer", "Python Backend Engineer", "Full Stack Developer")
      - Map employment types strictly to the allowed values
      - Return empty arrays for experience, education, skills, and social_links if none are found
      
      Document content:
      ${markdown.content}
    `;

    const { object } = await generateObject({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt,
      schema: userProfileSchema,
      temperature: 0.1,
    }).catch((error) => {
      console.error("Error generating object:", error);
      console.error("Prompt:", prompt);
      throw new Error(`Failed to generate structured data: ${error.message}`);
    });

    const userData = {
      _clerk: userId,
      display_name: object.display_name,
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
