import { Badge } from "~/components/ui/badge";
import { Briefcase } from "lucide-react";
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

interface ExperienceViewProps {
  experience: Experience[];
}

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

export const ExperienceView = ({ experience }: ExperienceViewProps) => {
  if (experience.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
          <Briefcase className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium">No experience information available</p>
        <p className="text-sm text-slate-400 mt-1">Add your professional experience to showcase your career journey</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {experience.map((exp, index) => (
        <div key={index} className="relative group">
          {/* Timeline line */}
          {index < experience.length - 1 && (
            <div className="absolute left-5 top-12 bottom-0 w-px bg-gradient-to-b from-slate-300 to-slate-200" />
          )}
          
          <div className="flex gap-4">
            {/* Timeline dot */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center shadow-sm group-hover:border-slate-300 transition-colors">
                <Briefcase className="h-4 w-4 text-slate-600" />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 space-y-3 pb-2">
              {/* Header */}
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-900 leading-tight">
                  {exp.title}
                </h3>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="font-medium">{exp.company}</span>
                  {exp.employment_type && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {formatEmploymentType(exp.employment_type)}
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-500 font-medium">
                  {formatDate(exp.start_date || null)} — {formatDate(exp.end_date || null)}
                </div>
              </div>
              
              {/* Description */}
              {exp.description && (
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                  {exp.description}
                </p>
              )}
              
              {/* Skills */}
              {exp.skills_used && exp.skills_used.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {exp.skills_used.slice(0, 5).map((skill, skillIndex) => (
                    <Badge 
                      key={skillIndex} 
                      variant="secondary" 
                      className="text-xs px-2 py-0.5 bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {exp.skills_used.length > 5 && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 border-slate-200"
                    >
                      +{exp.skills_used.length - 5} more
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