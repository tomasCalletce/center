import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

interface Education {
  institution?: string | null;
  degree?: string | null;
  field_of_study?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  gpa?: string | null;
}

interface ProfileEducationProps {
  education?: Education[] | null;
}

export const ProfileEducation = ({ education }: ProfileEducationProps) => {
  if (!education || education.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <div className="inline-flex items-center">
            <div className="h-1 w-6 bg-slate-900 rounded-full" />
            <span className="ml-3 text-sm uppercase tracking-wider font-medium">
              Education
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No education information available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardHeader>
        <div className="inline-flex items-center">
          <div className="h-1 w-6 bg-slate-900 rounded-full" />
          <span className="ml-3 text-sm uppercase tracking-wider font-medium">
            Education
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="space-y-2">
            <div className="font-semibold">{edu.institution}</div>
            <div className="flex flex-wrap gap-2">
              {edu.degree && (
                <Badge variant="secondary" className="border-dashed">{edu.degree}</Badge>
              )}
              {edu.field_of_study && (
                <Badge variant="outline" className="border-dashed">{edu.field_of_study}</Badge>
              )}
            </div>
            {(edu.start_date || edu.end_date) && (
              <div className="text-sm text-muted-foreground">
                {edu.start_date} - {edu.end_date || "Present"}
              </div>
            )}
            {edu.gpa && (
              <div className="text-sm text-muted-foreground">
                GPA: {edu.gpa}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}; 