import {
  experienceSchema,
  type User,
  type UserExperience,
} from "~/server/db/schemas/users";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface ExperienceEditProps {
  user: User;
  onChange: (user: User) => void;
}

export const ExperienceEdit = ({ user, onChange }: ExperienceEditProps) => {
  const experience = user.experience ?? [];

  const addExperience = () => {
    onChange({
      ...user,
      experience: [experienceSchema.parse({}), ...experience],
    });
  };

  const updateExperience = (
    index: number,
    field: keyof UserExperience,
    value: string | string[]
  ) => {
    const updated = experience.map((exp, i) => {
      if (i === index) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onChange({ ...user, experience: updated });
  };

  const removeExperience = (index: number) => {
    onChange({ ...user, experience: experience.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={addExperience} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Experience
      </Button>

      {experience.map((exp, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div className="text-sm font-medium">Experience {index + 1}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeExperience(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              value={exp.title ?? ""}
              onChange={(e) => updateExperience(index, "title", e.target.value)}
              placeholder="Job Title"
            />
            <Input
              value={exp.company ?? ""}
              onChange={(e) =>
                updateExperience(index, "company", e.target.value)
              }
              placeholder="Company"
            />
            <Input
              value={exp.start_date ?? ""}
              onChange={(e) =>
                updateExperience(index, "start_date", e.target.value)
              }
              placeholder="Start Date"
            />
            <Input
              value={exp.end_date ?? ""}
              onChange={(e) =>
                updateExperience(index, "end_date", e.target.value)
              }
              placeholder="End Date"
            />
          </div>

          <div>
            <Select
              value={exp.employment_type ?? undefined}
              onValueChange={(value) =>
                updateExperience(index, "employment_type", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Employment Type" />
              </SelectTrigger>
              <SelectContent>
                {experienceSchema.shape.employment_type
                  .unwrap()
                  .options.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea
            value={exp.description ?? ""}
            onChange={(e) =>
              updateExperience(index, "description", e.target.value)
            }
            placeholder="Job Description"
            rows={3}
          />
          {/* <SkillsField
            skills={exp.skills_used || []}
            onChange={(skills) =>
              updateExperience(index, "skills_used", skills)
            }
          /> */}
        </div>
      ))}
    </div>
  );
};
