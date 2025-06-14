import { logger, task } from "@trigger.dev/sdk/v3";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ConsolidatedMarkdown {
  content: string;
  metadata: {
    originalFileName: string;
    userId: string;
    totalPages: number;
    processedAt: string;
    averageConfidence: number;
    allElements: string[];
    pageBreakdown: Array<{
      pageNumber: number;
      confidence: number;
      elements: string[];
      contentLength: number;
    }>;
  };
}

interface ExtractJsonPayload {
  markdownUrl: string;
  markdownPath: string;
  consolidatedMarkdown: ConsolidatedMarkdown;
  userId: string;
}

interface UserProfileData {
  // Basic Profile Information
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  timezone?: string;
  
  // Contact & Social
  email?: string;
  phone?: string;
  github_username?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  portfolio_url?: string;
  
  // Employment Information
  employment_status?: string;
  available_for_hire?: boolean;
  current_title?: string;
  current_company?: string;
  industry?: string;
  experience_level?: string;
  years_of_experience?: number;
  
  // Job Seeking & Preferences
  job_seeking_status?: boolean;
  hourly_rate?: number;
  job_type_preferences?: string[];
  work_preferences?: string[];
  company_size_pref?: string;
  preferred_industries?: string[];
  salary_expectation_min?: number;
  salary_expectation_max?: number;
  salary_currency?: string;
  equity_interest?: boolean;
  benefits_priorities?: string[];
  availability_date?: string;
  notice_period_weeks?: number;
  willing_to_relocate?: boolean;
  preferred_locations?: string[];
  visa_status?: string;
  security_clearance?: string;
  
  // Career Aspirations
  career_goals?: string;
  ideal_role?: string;
  deal_breakers?: string[];
  motivations?: string[];
  
  // Skills & Expertise
  skills?: string[];
  programming_languages?: string[];
  frameworks?: string[];
  tools?: string[];
  specializations?: string[];
  soft_skills?: string[];
  
  // Education & Certifications
  education?: Array<{
    institution?: string;
    degree?: string;
    field?: string;
    graduationYear?: string;
  }>;
  certifications?: string[];
  languages?: string[];
  
  // Additional Information
  awards?: string[];
  notable_projects?: Array<{
    name?: string;
    description?: string;
    technologies?: string[];
    url?: string;
  }>;
  work_samples?: string[];
  references?: Array<{
    name?: string;
    title?: string;
    company?: string;
    contact?: string;
  }>;
  
  // Technical Stats
  github_stats?: {
    repos?: number;
    stars?: number;
    followers?: number;
  };
  stackoverflow_rep?: number;
  hackathon_wins?: number;
  open_source_contrib?: string[];
  
  // Team & Collaboration
  preferred_team_size?: number;
  preferred_roles?: string[];
  hackathon_experience?: number;
  
  // Privacy & Visibility Settings
  is_public?: boolean;
  is_searchable?: boolean;
  open_to_recruiters?: boolean;
  show_salary_info?: boolean;
  
  // Document Metadata
  sourceDocument?: string;
  extractedAt?: string;
  confidence?: number;
}

interface ExtractJsonResult {
  userProfileData: UserProfileData;
  extractionMetadata: {
    originalFileName: string;
    userId: string;
    extractedAt: string;
    confidence: number;
    fieldsExtracted: string[];
    processingNotes: string[];
  };
}

// Comprehensive Zod schema for structured extraction
const userProfileSchema = z.object({
  // Basic Profile Information
  display_name: z.string().nullable(),
  bio: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  location: z.string().nullable(),
  timezone: z.string().nullable(),
  
  // Contact & Social
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  github_username: z.string().nullable(),
  linkedin_url: z.string().url().nullable(),
  twitter_url: z.string().url().nullable(),
  website_url: z.string().url().nullable(),
  portfolio_url: z.string().url().nullable(),
  
  // Employment Information
  employment_status: z.string().nullable(),
  available_for_hire: z.boolean().nullable(),
  current_title: z.string().nullable(),
  current_company: z.string().nullable(),
  industry: z.string().nullable(),
  experience_level: z.string().nullable(),
  years_of_experience: z.number().nullable(),
  
  // Job Seeking & Preferences
  job_seeking_status: z.boolean().nullable(),
  hourly_rate: z.number().nullable(),
  job_type_preferences: z.array(z.string()),
  work_preferences: z.array(z.string()),
  company_size_pref: z.string().nullable(),
  preferred_industries: z.array(z.string()),
  salary_expectation_min: z.number().nullable(),
  salary_expectation_max: z.number().nullable(),
  salary_currency: z.string().nullable(),
  equity_interest: z.boolean().nullable(),
  benefits_priorities: z.array(z.string()),
  availability_date: z.string().nullable(),
  notice_period_weeks: z.number().nullable(),
  willing_to_relocate: z.boolean().nullable(),
  preferred_locations: z.array(z.string()),
  visa_status: z.string().nullable(),
  security_clearance: z.string().nullable(),
  
  // Career Aspirations
  career_goals: z.string().nullable(),
  ideal_role: z.string().nullable(),
  deal_breakers: z.array(z.string()),
  motivations: z.array(z.string()),
  
  // Skills & Expertise
  skills: z.array(z.string()),
  programming_languages: z.array(z.string()),
  frameworks: z.array(z.string()),
  tools: z.array(z.string()),
  specializations: z.array(z.string()),
  soft_skills: z.array(z.string()),
  
  // Education & Certifications
  education: z.array(z.object({
    institution: z.string().nullable(),
    degree: z.string().nullable(),
    field: z.string().nullable(),
    graduationYear: z.string().nullable(),
  })),
  certifications: z.array(z.string()),
  languages: z.array(z.string()),
  
  // Additional Information
  awards: z.array(z.string()),
  notable_projects: z.array(z.object({
    name: z.string().nullable(),
    description: z.string().nullable(),
    technologies: z.array(z.string()),
    url: z.string().url().nullable(),
  })),
  work_samples: z.array(z.string()),
  references: z.array(z.object({
    name: z.string().nullable(),
    title: z.string().nullable(),
    company: z.string().nullable(),
    contact: z.string().nullable(),
  })),
  
  // Technical Stats
  github_stats: z.object({
    repos: z.number().nullable(),
    stars: z.number().nullable(),
    followers: z.number().nullable(),
  }).nullable(),
  stackoverflow_rep: z.number().nullable(),
  hackathon_wins: z.number().nullable(),
  open_source_contrib: z.array(z.string()),
  
  // Team & Collaboration
  preferred_team_size: z.number().nullable(),
  preferred_roles: z.array(z.string()),
  hackathon_experience: z.number().nullable(),
  
  // Privacy & Visibility Settings
  is_public: z.boolean().nullable(),
  is_searchable: z.boolean().nullable(),
  open_to_recruiters: z.boolean().nullable(),
  show_salary_info: z.boolean().nullable(),
});

export const extractJsonStructureTask = task({
  id: "pdf-processing.extract-json-structure",
  maxDuration: 600,
  run: async (payload: ExtractJsonPayload): Promise<ExtractJsonResult> => {
    logger.log("Starting comprehensive JSON structure extraction from markdown", { 
      userId: payload.userId,
      markdownUrl: payload.markdownUrl
    });

    try {
      const prompt = `
        Extract comprehensive structured information from the following resume/CV document and format it as a JSON object for a detailed user profile.
        
        Please extract ALL available information including:
        
        PERSONAL & CONTACT:
        - Full name, bio/summary, location, timezone
        - Email, phone, social media links (GitHub, LinkedIn, Twitter)
        - Website, portfolio URLs
        
        EMPLOYMENT & CAREER:
        - Current title, company, industry, employment status
        - Experience level, years of experience
        - Job seeking status, availability for hire
        - Salary expectations, hourly rate, currency preferences
        - Work preferences (remote, hybrid, on-site)
        - Company size preferences, preferred industries
        - Benefits priorities, equity interest
        - Availability date, notice period, willing to relocate
        - Preferred locations, visa status, security clearance
        
        CAREER ASPIRATIONS:
        - Career goals, ideal role description
        - Deal breakers, motivations
        
        SKILLS & EXPERTISE:
        - Technical skills, programming languages
        - Frameworks, tools, specializations
        - Soft skills, languages spoken
        
        EDUCATION & CERTIFICATIONS:
        - Educational background (institution, degree, field, graduation year)
        - Professional certifications
        
        ADDITIONAL INFORMATION:
        - Awards and recognitions
        - Notable projects (name, description, technologies, URLs)
        - Work samples, references
        - GitHub stats, StackOverflow reputation
        - Hackathon wins and experience
        - Open source contributions
        
        PREFERENCES:
        - Preferred team size, roles
        - Privacy settings (public profile, searchable, open to recruiters)
        
        For arrays, extract multiple items when available. For boolean fields, infer from context when possible.
        If information is not found, use null for strings/numbers/objects, empty arrays for arrays, and null for booleans when unclear.
        Be thorough and extract as much relevant information as possible from the document.
        
        Document content:
        ${payload.consolidatedMarkdown.content}
      `;

      const { object } = await generateObject({
        model: openai("gpt-4o"),
        prompt,
        schema: userProfileSchema,
        temperature: 0.1,
      });

      // Convert null values to undefined and structure the data
      const userProfileData: UserProfileData = {
        // Basic Profile Information
        display_name: object.display_name || undefined,
        bio: object.bio || undefined,
        avatar_url: object.avatar_url || undefined,
        location: object.location || undefined,
        timezone: object.timezone || undefined,
        
        // Contact & Social
        email: object.email || undefined,
        phone: object.phone || undefined,
        github_username: object.github_username || undefined,
        linkedin_url: object.linkedin_url || undefined,
        twitter_url: object.twitter_url || undefined,
        website_url: object.website_url || undefined,
        portfolio_url: object.portfolio_url || undefined,
        
        // Employment Information
        employment_status: object.employment_status || undefined,
        available_for_hire: object.available_for_hire ?? undefined,
        current_title: object.current_title || undefined,
        current_company: object.current_company || undefined,
        industry: object.industry || undefined,
        experience_level: object.experience_level || undefined,
        years_of_experience: object.years_of_experience ?? undefined,
        
        // Job Seeking & Preferences
        job_seeking_status: object.job_seeking_status ?? undefined,
        hourly_rate: object.hourly_rate ?? undefined,
        job_type_preferences: object.job_type_preferences.length > 0 ? object.job_type_preferences : undefined,
        work_preferences: object.work_preferences.length > 0 ? object.work_preferences : undefined,
        company_size_pref: object.company_size_pref || undefined,
        preferred_industries: object.preferred_industries.length > 0 ? object.preferred_industries : undefined,
        salary_expectation_min: object.salary_expectation_min ?? undefined,
        salary_expectation_max: object.salary_expectation_max ?? undefined,
        salary_currency: object.salary_currency || "USD",
        equity_interest: object.equity_interest ?? undefined,
        benefits_priorities: object.benefits_priorities.length > 0 ? object.benefits_priorities : undefined,
        availability_date: object.availability_date || undefined,
        notice_period_weeks: object.notice_period_weeks ?? undefined,
        willing_to_relocate: object.willing_to_relocate ?? undefined,
        preferred_locations: object.preferred_locations.length > 0 ? object.preferred_locations : undefined,
        visa_status: object.visa_status || undefined,
        security_clearance: object.security_clearance || undefined,
        
        // Career Aspirations
        career_goals: object.career_goals || undefined,
        ideal_role: object.ideal_role || undefined,
        deal_breakers: object.deal_breakers.length > 0 ? object.deal_breakers : undefined,
        motivations: object.motivations.length > 0 ? object.motivations : undefined,
        
        // Skills & Expertise
        skills: object.skills.length > 0 ? object.skills : undefined,
        programming_languages: object.programming_languages.length > 0 ? object.programming_languages : undefined,
        frameworks: object.frameworks.length > 0 ? object.frameworks : undefined,
        tools: object.tools.length > 0 ? object.tools : undefined,
        specializations: object.specializations.length > 0 ? object.specializations : undefined,
        soft_skills: object.soft_skills.length > 0 ? object.soft_skills : undefined,
        
        // Education & Certifications
        education: object.education.length > 0 ? object.education.map(edu => ({
          institution: edu.institution || undefined,
          degree: edu.degree || undefined,
          field: edu.field || undefined,
          graduationYear: edu.graduationYear || undefined,
        })) : undefined,
        certifications: object.certifications.length > 0 ? object.certifications : undefined,
        languages: object.languages.length > 0 ? object.languages : undefined,
        
        // Additional Information
        awards: object.awards.length > 0 ? object.awards : undefined,
        notable_projects: object.notable_projects.length > 0 ? object.notable_projects.map(project => ({
          name: project.name || undefined,
          description: project.description || undefined,
          technologies: project.technologies.length > 0 ? project.technologies : undefined,
          url: project.url || undefined,
        })) : undefined,
        work_samples: object.work_samples.length > 0 ? object.work_samples : undefined,
        references: object.references.length > 0 ? object.references.map(ref => ({
          name: ref.name || undefined,
          title: ref.title || undefined,
          company: ref.company || undefined,
          contact: ref.contact || undefined,
        })) : undefined,
        
        // Technical Stats
        github_stats: object.github_stats ? {
          repos: object.github_stats.repos ?? undefined,
          stars: object.github_stats.stars ?? undefined,
          followers: object.github_stats.followers ?? undefined,
        } : undefined,
        stackoverflow_rep: object.stackoverflow_rep ?? undefined,
        hackathon_wins: object.hackathon_wins ?? 0,
        open_source_contrib: object.open_source_contrib.length > 0 ? object.open_source_contrib : undefined,
        
        // Team & Collaboration
        preferred_team_size: object.preferred_team_size ?? undefined,
        preferred_roles: object.preferred_roles.length > 0 ? object.preferred_roles : undefined,
        hackathon_experience: object.hackathon_experience ?? 0,
        
        // Privacy & Visibility Settings
        is_public: object.is_public ?? true,
        is_searchable: object.is_searchable ?? true,
        open_to_recruiters: object.open_to_recruiters ?? false,
        show_salary_info: object.show_salary_info ?? false,
        
        // Document Metadata
        sourceDocument: payload.consolidatedMarkdown.metadata.originalFileName,
        extractedAt: new Date().toISOString(),
        confidence: payload.consolidatedMarkdown.metadata.averageConfidence,
      };

      // Count extracted fields
      const fieldsExtracted = Object.keys(userProfileData).filter(key => {
        const value = userProfileData[key as keyof UserProfileData];
        return value !== null && value !== undefined && 
               (typeof value !== 'object' || 
                (Array.isArray(value) && value.length > 0) ||
                (!Array.isArray(value) && Object.keys(value).length > 0));
      });

      const extractionMetadata = {
        originalFileName: payload.consolidatedMarkdown.metadata.originalFileName,
        userId: payload.userId,
        extractedAt: new Date().toISOString(),
        confidence: payload.consolidatedMarkdown.metadata.averageConfidence,
        fieldsExtracted,
        processingNotes: [
          `Processed ${payload.consolidatedMarkdown.metadata.totalPages} pages`,
          `Extracted ${fieldsExtracted.length} profile fields`,
          `Average confidence: ${(payload.consolidatedMarkdown.metadata.averageConfidence * 100).toFixed(1)}%`
        ]
      };

      logger.log("Comprehensive JSON structure extraction completed", {
        fieldsExtracted: fieldsExtracted.length,
        confidence: payload.consolidatedMarkdown.metadata.averageConfidence,
        userId: payload.userId
      });

      return {
        userProfileData,
        extractionMetadata
      };
    } catch (error) {
      logger.error("Failed to extract JSON structure", { error });
      throw new Error(`JSON extraction failed: ${error}`);
    }
  },
}); 