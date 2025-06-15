import { logger, task } from "@trigger.dev/sdk/v3";
import { db } from "~/server/db/connection";
import { userProfiles } from "~/server/db/schemas/user-profiles";
import { eq } from "drizzle-orm";

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

interface UpdateUserProfilesPayload {
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

interface UpdateUserProfilesResult {
  profileId: string;
  userId: string;
  fieldsUpdated: string[];
  updateStatus: 'success' | 'partial' | 'failed';
  updateNotes: string[];
}

export const updateUserProfilesTask = task({
  id: "pdf-processing.update-user-profiles",
  maxDuration: 300,
  run: async (payload: UpdateUserProfilesPayload): Promise<UpdateUserProfilesResult> => {
    logger.log("Starting comprehensive user profile update", { 
      userId: payload.extractionMetadata.userId,
      fieldsToUpdate: payload.extractionMetadata.fieldsExtracted.length
    });

    try {
      const { userProfileData, extractionMetadata } = payload;
      const updateNotes: string[] = [];
      const fieldsUpdated: string[] = [];

      // Prepare profile data for database update
      const profileUpdateData: any = {
        _user: extractionMetadata.userId,
        updated_at: new Date(),
      };

      // Basic Profile Information
      if (userProfileData.display_name) {
        profileUpdateData.display_name = userProfileData.display_name;
        fieldsUpdated.push('display_name');
      }

      if (userProfileData.bio) {
        profileUpdateData.bio = userProfileData.bio;
        fieldsUpdated.push('bio');
      }

      if (userProfileData.avatar_url) {
        profileUpdateData.avatar_url = userProfileData.avatar_url;
        fieldsUpdated.push('avatar_url');
      }

      if (userProfileData.location) {
        profileUpdateData.location = userProfileData.location;
        fieldsUpdated.push('location');
      }

      if (userProfileData.timezone) {
        profileUpdateData.timezone = userProfileData.timezone;
        fieldsUpdated.push('timezone');
      }

      // Contact & Social
      if (userProfileData.github_username) {
        profileUpdateData.github_username = userProfileData.github_username;
        fieldsUpdated.push('github_username');
      }

      if (userProfileData.linkedin_url) {
        profileUpdateData.linkedin_url = userProfileData.linkedin_url;
        fieldsUpdated.push('linkedin_url');
      }

      if (userProfileData.twitter_url) {
        profileUpdateData.twitter_url = userProfileData.twitter_url;
        fieldsUpdated.push('twitter_url');
      }

      if (userProfileData.website_url) {
        profileUpdateData.website_url = userProfileData.website_url;
        fieldsUpdated.push('website_url');
      }

      if (userProfileData.portfolio_url) {
        profileUpdateData.portfolio_url = userProfileData.portfolio_url;
        fieldsUpdated.push('portfolio_url');
      }

      // Employment Information
      if (userProfileData.employment_status) {
        profileUpdateData.employment_status = userProfileData.employment_status;
        fieldsUpdated.push('employment_status');
      }

      if (userProfileData.available_for_hire !== undefined) {
        profileUpdateData.available_for_hire = userProfileData.available_for_hire;
        fieldsUpdated.push('available_for_hire');
      }

      if (userProfileData.current_title) {
        profileUpdateData.current_title = userProfileData.current_title;
        fieldsUpdated.push('current_title');
      }

      if (userProfileData.current_company) {
        profileUpdateData.current_company = userProfileData.current_company;
        fieldsUpdated.push('current_company');
      }

      if (userProfileData.industry) {
        profileUpdateData.industry = userProfileData.industry;
        fieldsUpdated.push('industry');
      }

      if (userProfileData.experience_level) {
        profileUpdateData.experience_level = userProfileData.experience_level;
        fieldsUpdated.push('experience_level');
      }

      if (userProfileData.years_of_experience !== undefined) {
        profileUpdateData.years_of_experience = userProfileData.years_of_experience;
        fieldsUpdated.push('years_of_experience');
      }

      // Job Seeking & Preferences
      if (userProfileData.job_seeking_status !== undefined) {
        profileUpdateData.job_seeking_status = userProfileData.job_seeking_status;
        fieldsUpdated.push('job_seeking_status');
      }

      if (userProfileData.hourly_rate !== undefined) {
        profileUpdateData.hourly_rate = userProfileData.hourly_rate;
        fieldsUpdated.push('hourly_rate');
      }

      if (userProfileData.job_type_preferences?.length) {
        profileUpdateData.job_type_preferences = userProfileData.job_type_preferences;
        fieldsUpdated.push('job_type_preferences');
      }

      if (userProfileData.work_preferences?.length) {
        profileUpdateData.work_preferences = userProfileData.work_preferences;
        fieldsUpdated.push('work_preferences');
      }

      if (userProfileData.company_size_pref) {
        profileUpdateData.company_size_pref = userProfileData.company_size_pref;
        fieldsUpdated.push('company_size_pref');
      }

      if (userProfileData.preferred_industries?.length) {
        profileUpdateData.preferred_industries = userProfileData.preferred_industries;
        fieldsUpdated.push('preferred_industries');
      }

      if (userProfileData.salary_expectation_min !== undefined) {
        profileUpdateData.salary_expectation_min = userProfileData.salary_expectation_min;
        fieldsUpdated.push('salary_expectation_min');
      }

      if (userProfileData.salary_expectation_max !== undefined) {
        profileUpdateData.salary_expectation_max = userProfileData.salary_expectation_max;
        fieldsUpdated.push('salary_expectation_max');
      }

      if (userProfileData.salary_currency) {
        profileUpdateData.salary_currency = userProfileData.salary_currency;
        fieldsUpdated.push('salary_currency');
      }

      if (userProfileData.equity_interest !== undefined) {
        profileUpdateData.equity_interest = userProfileData.equity_interest;
        fieldsUpdated.push('equity_interest');
      }

      if (userProfileData.benefits_priorities?.length) {
        profileUpdateData.benefits_priorities = userProfileData.benefits_priorities;
        fieldsUpdated.push('benefits_priorities');
      }

      if (userProfileData.availability_date) {
        profileUpdateData.availability_date = userProfileData.availability_date;
        fieldsUpdated.push('availability_date');
      }

      if (userProfileData.notice_period_weeks !== undefined) {
        profileUpdateData.notice_period_weeks = userProfileData.notice_period_weeks;
        fieldsUpdated.push('notice_period_weeks');
      }

      if (userProfileData.willing_to_relocate !== undefined) {
        profileUpdateData.willing_to_relocate = userProfileData.willing_to_relocate;
        fieldsUpdated.push('willing_to_relocate');
      }

      if (userProfileData.preferred_locations?.length) {
        profileUpdateData.preferred_locations = userProfileData.preferred_locations;
        fieldsUpdated.push('preferred_locations');
      }

      if (userProfileData.visa_status) {
        profileUpdateData.visa_status = userProfileData.visa_status;
        fieldsUpdated.push('visa_status');
      }

      if (userProfileData.security_clearance) {
        profileUpdateData.security_clearance = userProfileData.security_clearance;
        fieldsUpdated.push('security_clearance');
      }

      // Career Aspirations
      if (userProfileData.career_goals) {
        profileUpdateData.career_goals = userProfileData.career_goals;
        fieldsUpdated.push('career_goals');
      }

      if (userProfileData.ideal_role) {
        profileUpdateData.ideal_role = userProfileData.ideal_role;
        fieldsUpdated.push('ideal_role');
      }

      if (userProfileData.deal_breakers?.length) {
        profileUpdateData.deal_breakers = userProfileData.deal_breakers;
        fieldsUpdated.push('deal_breakers');
      }

      if (userProfileData.motivations?.length) {
        profileUpdateData.motivations = userProfileData.motivations;
        fieldsUpdated.push('motivations');
      }

      // Skills & Expertise
      if (userProfileData.skills?.length) {
        profileUpdateData.skills = userProfileData.skills;
        fieldsUpdated.push('skills');
      }

      if (userProfileData.programming_languages?.length) {
        profileUpdateData.programming_languages = userProfileData.programming_languages;
        fieldsUpdated.push('programming_languages');
      }

      if (userProfileData.frameworks?.length) {
        profileUpdateData.frameworks = userProfileData.frameworks;
        fieldsUpdated.push('frameworks');
      }

      if (userProfileData.tools?.length) {
        profileUpdateData.tools = userProfileData.tools;
        fieldsUpdated.push('tools');
      }

      if (userProfileData.specializations?.length) {
        profileUpdateData.specializations = userProfileData.specializations;
        fieldsUpdated.push('specializations');
      }

      if (userProfileData.soft_skills?.length) {
        profileUpdateData.soft_skills = userProfileData.soft_skills;
        fieldsUpdated.push('soft_skills');
      }

      // Education & Certifications
      if (userProfileData.education?.length) {
        profileUpdateData.education = userProfileData.education;
        fieldsUpdated.push('education');
      }

      if (userProfileData.certifications?.length) {
        profileUpdateData.certifications = userProfileData.certifications;
        fieldsUpdated.push('certifications');
      }

      if (userProfileData.languages?.length) {
        profileUpdateData.languages = userProfileData.languages;
        fieldsUpdated.push('languages');
      }

      // Additional Information
      if (userProfileData.awards?.length) {
        profileUpdateData.awards = userProfileData.awards;
        fieldsUpdated.push('awards');
      }

      if (userProfileData.notable_projects?.length) {
        profileUpdateData.notable_projects = userProfileData.notable_projects;
        fieldsUpdated.push('notable_projects');
      }

      if (userProfileData.work_samples?.length) {
        profileUpdateData.work_samples = userProfileData.work_samples;
        fieldsUpdated.push('work_samples');
      }

      if (userProfileData.references?.length) {
        profileUpdateData.references = userProfileData.references;
        fieldsUpdated.push('references');
      }

      // Technical Stats
      if (userProfileData.github_stats) {
        profileUpdateData.github_stats = userProfileData.github_stats;
        fieldsUpdated.push('github_stats');
      }

      if (userProfileData.stackoverflow_rep !== undefined) {
        profileUpdateData.stackoverflow_rep = userProfileData.stackoverflow_rep;
        fieldsUpdated.push('stackoverflow_rep');
      }

      if (userProfileData.hackathon_wins !== undefined) {
        profileUpdateData.hackathon_wins = userProfileData.hackathon_wins;
        fieldsUpdated.push('hackathon_wins');
      }

      if (userProfileData.open_source_contrib?.length) {
        profileUpdateData.open_source_contrib = userProfileData.open_source_contrib;
        fieldsUpdated.push('open_source_contrib');
      }

      // Team & Collaboration
      if (userProfileData.preferred_team_size !== undefined) {
        profileUpdateData.preferred_team_size = userProfileData.preferred_team_size;
        fieldsUpdated.push('preferred_team_size');
      }

      if (userProfileData.preferred_roles?.length) {
        profileUpdateData.preferred_roles = userProfileData.preferred_roles;
        fieldsUpdated.push('preferred_roles');
      }

      if (userProfileData.hackathon_experience !== undefined) {
        profileUpdateData.hackathon_experience = userProfileData.hackathon_experience;
        fieldsUpdated.push('hackathon_experience');
      }

      // Privacy & Visibility Settings
      if (userProfileData.is_public !== undefined) {
        profileUpdateData.is_public = userProfileData.is_public;
        fieldsUpdated.push('is_public');
      }

      if (userProfileData.is_searchable !== undefined) {
        profileUpdateData.is_searchable = userProfileData.is_searchable;
        fieldsUpdated.push('is_searchable');
      }

      if (userProfileData.open_to_recruiters !== undefined) {
        profileUpdateData.open_to_recruiters = userProfileData.open_to_recruiters;
        fieldsUpdated.push('open_to_recruiters');
      }

      if (userProfileData.show_salary_info !== undefined) {
        profileUpdateData.show_salary_info = userProfileData.show_salary_info;
        fieldsUpdated.push('show_salary_info');
      }

      // Update or create user profile
      let profileId: string;
      let updateStatus: 'success' | 'partial' | 'failed' = 'success';

      try {
        // First, try to get existing profile
        const [existingProfile] = await db
          .select()
          .from(userProfiles)
          .where(eq(userProfiles._user, extractionMetadata.userId))
          .limit(1);

        if (existingProfile) {
          // Update existing profile
          const [updatedProfile] = await db
            .update(userProfiles)
            .set(profileUpdateData)
            .where(eq(userProfiles.id, existingProfile.id))
            .returning({ id: userProfiles.id });
          
          profileId = updatedProfile!.id;
          updateNotes.push('Updated existing user profile');
        } else {
          // Create new profile - ensure display_name is provided
          if (!profileUpdateData.display_name) {
            profileUpdateData.display_name = 'User Profile'; // Default display name
          }
          
          const [newProfile] = await db
            .insert(userProfiles)
            .values(profileUpdateData)
            .returning({ id: userProfiles.id });
          
          profileId = newProfile!.id;
          updateNotes.push('Created new user profile');
        }

        updateNotes.push(`Successfully processed ${fieldsUpdated.length} profile fields`);
        
        logger.log("Comprehensive user profile updated successfully", {
          profileId,
          userId: extractionMetadata.userId,
          fieldsUpdated: fieldsUpdated.length,
          totalFields: Object.keys(profileUpdateData).length
        });

      } catch (dbError) {
        logger.error("Database operation failed", { dbError });
        updateStatus = 'failed';
        updateNotes.push(`Database error: ${dbError}`);
        profileId = 'failed';
      }

      return {
        profileId,
        userId: extractionMetadata.userId,
        fieldsUpdated,
        updateStatus,
        updateNotes
      };

    } catch (error) {
      logger.error("Failed to update user profile", { error });
      return {
        profileId: 'failed',
        userId: payload.extractionMetadata.userId,
        fieldsUpdated: [],
        updateStatus: 'failed',
        updateNotes: [`Update failed: ${error}`]
      };
    }
  },
}); 