"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { 
  User, 
  MapPin, 
  Clock, 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  Github, 
  Linkedin, 
  Twitter,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Languages,
  DollarSign,
  Users,
  Target,
  Star,
  Calendar,
  Shield
} from "lucide-react";

interface UserProfileData {
  display_name?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  github_username?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  portfolio_url?: string;
  employment_status?: string;
  available_for_hire?: boolean;
  current_title?: string;
  current_company?: string;
  industry?: string;
  experience_level?: string;
  years_of_experience?: number;
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
  career_goals?: string;
  ideal_role?: string;
  deal_breakers?: string[];
  motivations?: string[];
  skills?: string[];
  programming_languages?: string[];
  frameworks?: string[];
  tools?: string[];
  specializations?: string[];
  soft_skills?: string[];
  education?: Array<{
    institution?: string;
    degree?: string;
    field?: string;
    graduationYear?: string;
  }>;
  certifications?: string[];
  languages?: string[];
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
  github_stats?: {
    repos?: number;
    stars?: number;
    followers?: number;
  };
  stackoverflow_rep?: number;
  hackathon_wins?: number;
  open_source_contrib?: string[];
  preferred_team_size?: number;
  preferred_roles?: string[];
  hackathon_experience?: number;
  is_public?: boolean;
  is_searchable?: boolean;
  open_to_recruiters?: boolean;
  show_salary_info?: boolean;
}

interface CVProfileDisplayProps {
  profileData: UserProfileData;
}

export function CVProfileDisplay({ profileData }: CVProfileDisplayProps) {
  const formatSalaryRange = () => {
    if (profileData.salary_expectation_min || profileData.salary_expectation_max) {
      const min = profileData.salary_expectation_min ? `${profileData.salary_expectation_min}` : '';
      const max = profileData.salary_expectation_max ? `${profileData.salary_expectation_max}` : '';
      const currency = profileData.salary_currency || 'USD';
      
      if (min && max) {
        return `${min} - ${max} ${currency}`;
      } else if (min) {
        return `${min}+ ${currency}`;
      } else if (max) {
        return `Up to ${max} ${currency}`;
      }
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="w-6 h-6" />
                {profileData.display_name || 'Professional Profile'}
              </CardTitle>
              {profileData.current_title && (
                <div className="flex items-center gap-2 text-lg text-muted-foreground">
                  <Briefcase className="w-5 h-5" />
                  {profileData.current_title}
                  {profileData.current_company && ` at ${profileData.current_company}`}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {profileData.available_for_hire && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Available for Hire
                </Badge>
              )}
              {profileData.job_seeking_status && (
                <Badge variant="secondary">
                  Job Seeking
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileData.bio && (
            <p className="text-muted-foreground">{profileData.bio}</p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {profileData.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {profileData.location}
              </div>
            )}
            {profileData.timezone && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {profileData.timezone}
              </div>
            )}
            {profileData.industry && (
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {profileData.industry}
              </div>
            )}
            {profileData.experience_level && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {profileData.experience_level}
              </div>
            )}
          </div>

          {/* Contact & Social Links */}
          <div className="flex flex-wrap gap-2">
            {profileData.github_username && (
              <Button variant="outline" size="sm" asChild>
                <a href={`https://github.com/${profileData.github_username}`} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-1" />
                  GitHub
                </a>
              </Button>
            )}
            {profileData.linkedin_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={profileData.linkedin_url} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-1" />
                  LinkedIn
                </a>
              </Button>
            )}
            {profileData.twitter_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={profileData.twitter_url} target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-4 h-4 mr-1" />
                  Twitter
                </a>
              </Button>
            )}
            {profileData.website_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={profileData.website_url} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-1" />
                  Website
                </a>
              </Button>
            )}
            {profileData.portfolio_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={profileData.portfolio_url} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-1" />
                  Portfolio
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills & Expertise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Skills & Expertise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profileData.programming_languages && profileData.programming_languages.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Programming Languages</h4>
                <div className="flex flex-wrap gap-1">
                  {profileData.programming_languages.map((lang, index) => (
                    <Badge key={index} variant="secondary">{lang}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {profileData.frameworks && profileData.frameworks.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Frameworks</h4>
                <div className="flex flex-wrap gap-1">
                  {profileData.frameworks.map((framework, index) => (
                    <Badge key={index} variant="outline">{framework}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {profileData.tools && profileData.tools.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Tools</h4>
                <div className="flex flex-wrap gap-1">
                  {profileData.tools.map((tool, index) => (
                    <Badge key={index} variant="outline">{tool}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {profileData.skills && profileData.skills.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">General Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {profileData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {profileData.soft_skills && profileData.soft_skills.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Soft Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {profileData.soft_skills.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education & Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Education & Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profileData.education && profileData.education.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Education</h4>
                <div className="space-y-2">
                  {profileData.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-muted pl-3">
                      <div className="font-medium">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                      <div className="text-sm text-muted-foreground">{edu.institution}</div>
                      {edu.graduationYear && (
                        <div className="text-xs text-muted-foreground">{edu.graduationYear}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {profileData.certifications && profileData.certifications.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Certifications</h4>
                <div className="flex flex-wrap gap-1">
                  {profileData.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary">{cert}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {profileData.languages && profileData.languages.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  <Languages className="w-4 h-4" />
                  Languages
                </h4>
                <div className="flex flex-wrap gap-1">
                  {profileData.languages.map((lang, index) => (
                    <Badge key={index} variant="outline">{lang}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Work Preferences */}
        {(profileData.work_preferences || profileData.job_type_preferences || formatSalaryRange()) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Work Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.work_preferences && profileData.work_preferences.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Work Style</h4>
                  <div className="flex flex-wrap gap-1">
                    {profileData.work_preferences.map((pref, index) => (
                      <Badge key={index} variant="secondary">{pref}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {profileData.job_type_preferences && profileData.job_type_preferences.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Job Types</h4>
                  <div className="flex flex-wrap gap-1">
                    {profileData.job_type_preferences.map((type, index) => (
                      <Badge key={index} variant="outline">{type}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {formatSalaryRange() && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Salary Expectations
                  </h4>
                  <Badge variant="secondary">{formatSalaryRange()}</Badge>
                </div>
              )}
              
              {profileData.preferred_team_size && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Preferred Team Size
                  </h4>
                  <Badge variant="outline">{profileData.preferred_team_size} people</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notable Projects */}
        {profileData.notable_projects && profileData.notable_projects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Notable Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileData.notable_projects.map((project, index) => (
                  <div key={index} className="border-l-2 border-muted pl-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{project.name}</h4>
                      {project.url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={project.url} target="_blank" rel="noopener noreferrer">
                            <Globe className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">{tech}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Career Goals */}
      {(profileData.career_goals || profileData.ideal_role) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Career Aspirations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profileData.career_goals && (
              <div>
                <h4 className="font-medium mb-2">Career Goals</h4>
                <p className="text-muted-foreground">{profileData.career_goals}</p>
              </div>
            )}
            
            {profileData.ideal_role && (
              <div>
                <h4 className="font-medium mb-2">Ideal Role</h4>
                <p className="text-muted-foreground">{profileData.ideal_role}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 