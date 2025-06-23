import { Badge } from "~/components/ui/badge";
import { Code2 } from "lucide-react";

interface SkillsViewProps {
  skills: string[];
}

export const SkillsView = ({ skills }: SkillsViewProps) => {
  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
          <Code2 className="h-5 w-5 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium text-sm">No skills listed</p>
        <p className="text-xs text-slate-400 mt-1">
          Add your technical skills and expertise
        </p>
      </div>
    );
  }

  const primarySkills = skills.slice(0, 8);
  const secondarySkills = skills.slice(8);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {primarySkills.map((skill, index) => (
          <Badge
            key={index}
            className="px-3 py-1.5 bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 transition-colors font-medium"
          >
            {skill}
          </Badge>
        ))}
      </div>

      {secondarySkills.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <div className="flex flex-wrap gap-1.5">
            {secondarySkills.map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-2 py-0.5 text-xs bg-white border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 