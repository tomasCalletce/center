import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Briefcase, Wrench, GraduationCap, Building2 } from "lucide-react";

interface Experience {
  start_date?: string | null;
  end_date?: string | null;
  title?: string | null;
  company?: string | null;
}

interface Education {
  degree?: string | null;
  institution?: string | null;
}

interface ProfileStatsProps {
  user: {
    experience?: Experience[] | null;
    education?: Education[] | null;
    skills?: string[] | null;
  };
}

export const ProfileStats = ({ user }: ProfileStatsProps) => {
  const calculateExperienceYears = () => {
    if (!user.experience || user.experience.length === 0) return 0;
    
    const currentYear = new Date().getFullYear();
    const startYears = user.experience
      .map(exp => exp.start_date ? new Date(exp.start_date).getFullYear() : currentYear)
      .filter(year => !isNaN(year));
    
    if (startYears.length === 0) return 0;
    return currentYear - Math.min.apply(Math, startYears);
  };

  const stats = [
    {
      label: "Years Experience",
      value: calculateExperienceYears(),
      icon: Briefcase
    },
    {
      label: "Skills",
      value: user.skills?.length || 0,
      icon: Wrench
    },
    {
      label: "Education",
      value: user.education?.length || 0,
      icon: GraduationCap
    },
    {
      label: "Companies",
      value: user.experience?.length || 0,
      icon: Building2
    }
  ];

  return (
    <Card className="border-dashed">
      <CardHeader>
        <div className="inline-flex items-center">
          <div className="h-1 w-6 bg-slate-900 rounded-full" />
          <span className="ml-3 text-sm uppercase tracking-wider font-medium">
            Profile Overview
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center space-y-2">
                <IconComponent className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}; 