import { Badge } from "~/components/ui/badge";
import { GraduationCap } from "lucide-react";
import { type User } from "~/server/db/schemas/users";

interface EducationViewProps {
  user: User;
}

export const EducationView = ({ user }: EducationViewProps) => {
  if (!user || !user.education || user.education.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
          <GraduationCap className="h-5 w-5 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium text-sm">
          No education information available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {user.education.map((edu, index) => (
        <div key={index} className="relative group">
          {/* Timeline line */}
          {index < (user.education?.length ?? 0) - 1 && (
            <div className="absolute left-5 top-12 bottom-0 w-px bg-gradient-to-b from-slate-300 to-slate-200" />
          )}

          <div className="flex gap-4">
            {/* Timeline dot */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center shadow-sm group-hover:border-slate-300 transition-colors">
                <GraduationCap className="h-4 w-4 text-slate-600" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2 pb-2">
              {/* Header */}
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-900 leading-tight">
                  {edu.institution}
                </h3>
                <div className="text-sm text-slate-500 font-medium">
                  {edu.start_date} — {edu.end_date}
                </div>
              </div>

              {/* Degree and field */}
              <div className="flex flex-wrap gap-1.5">
                {edu.degree && (
                  <Badge className="px-2 py-0.5 text-xs bg-slate-100 text-slate-700 border-slate-200 font-medium">
                    {edu.degree}
                  </Badge>
                )}
                {edu.field_of_study && (
                  <Badge
                    variant="outline"
                    className="px-2 py-0.5 text-xs bg-white border-slate-200 text-slate-600"
                  >
                    {edu.field_of_study}
                  </Badge>
                )}
              </div>

              {/* GPA */}
              {edu.gpa && (
                <div className="text-xs text-slate-500 font-medium">
                  GPA: {edu.gpa}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
