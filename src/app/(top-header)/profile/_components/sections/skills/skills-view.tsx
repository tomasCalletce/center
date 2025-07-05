import { Badge } from "~/components/ui/badge";
import { Code2 } from "lucide-react";
import { type User } from "~/server/db/schemas/users";

interface SkillsViewProps {
  user: User;
}

export const SkillsView: React.FC<SkillsViewProps> = ({ user }) => {
  if (!user || !user.skills || user.skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
          <Code2 className="h-5 w-5 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium text-sm">No skills listed</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {user.skills.map((skill, index) => (
          <Badge
            key={index}
            className="px-3 py-1.5 bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 transition-colors font-medium"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};
