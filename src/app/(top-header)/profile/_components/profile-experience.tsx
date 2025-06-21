"use client";

import { Badge } from "~/components/ui/badge";
import { EditableSection } from "./editable-section";
import { ExperienceField } from "./form-fields";
import { updateProfileExperience } from "../_actions/update-profile";
import { toast } from "sonner";
import { type EmploymentType } from "~/server/db/schemas/users";

interface Experience {
  title?: string | null;
  company?: string | null;
  employment_type?: EmploymentType | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  skills_used?: string[] | null;
}

interface ProfileExperienceProps {
  experience?: Experience[] | null;
}

export const ProfileExperience = ({ experience }: ProfileExperienceProps) => {
  const experienceData = experience || [];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    if (dateString.toLowerCase() === "present") return "Present";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "short" 
      });
    } catch {
      return dateString;
    }
  };

  const formatEmploymentType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('-');
  };

  const renderView = (data: Experience[]) => {
    if (data.length === 0) {
      return <p className="text-muted-foreground">No experience information available</p>;
    }

    return (
      <div className="space-y-6">
        {data.map((exp, index) => (
          <div key={index} className="relative">
            {index < data.length - 1 && (
              <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-border" />
            )}
            
            <div className="flex gap-3">
              <div className="w-4 h-4 rounded-full bg-primary mt-1 shrink-0 relative z-10" />
              
              <div className="space-y-2 pb-4">
                <div>
                  <div className="font-semibold text-sm leading-tight">
                    {exp.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {exp.company}
                    {exp.employment_type && (
                      <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">
                        {formatEmploymentType(exp.employment_type)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(exp.start_date || null)} - {formatDate(exp.end_date || null)}
                  </div>
                </div>
                
                {exp.description && (
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {exp.description}
                  </p>
                )}
                
                {exp.skills_used && exp.skills_used.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {exp.skills_used.slice(0, 3).map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs px-1 py-0 border-dashed">
                        {skill}
                      </Badge>
                    ))}
                    {exp.skills_used.length > 3 && (
                      <Badge variant="outline" className="text-xs px-1 py-0 border-dashed">
                        +{exp.skills_used.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderEdit = (data: Experience[], onChange: (data: Experience[]) => void) => {
    return <ExperienceField experience={data} onChange={onChange} />;
  };

  const handleSave = async (data: Experience[]) => {
    const result = await updateProfileExperience(data);
    if (result.error) {
      toast.error(result.error);
      throw new Error(result.error);
    }
    toast.success("Experience updated successfully!");
  };

  return (
    <EditableSection
      title="Experience"
      data={experienceData}
      renderView={renderView}
      renderEdit={renderEdit}
      onSave={handleSave}
      className="h-full border-dashed"
    />
  );
}; 