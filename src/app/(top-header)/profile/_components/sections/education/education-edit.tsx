import { type User, type UserEducation } from "~/server/db/schemas/users";
import { Button } from "~/components/ui/button";
import { Plus, X } from "lucide-react";
import { TextField } from "~/app/(top-header)/profile/_components/form-controls/text-field";

interface EducationEditProps {
  user: User;
  onChange: (user: User) => void;
}

export const EducationEdit = ({ user, onChange }: EducationEditProps) => {
  const education = user.education || [];

  const addEducation = () => {
    const newEducation: UserEducation = {
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      gpa: "",
      relevant_coursework: [],
    };
    const updatedEducation = [newEducation, ...education];
    onChange({ ...user, education: updatedEducation });
  };

  const updateEducation = (
    index: number,
    field: keyof UserEducation,
    value: string
  ) => {
    const updated = education.map((edu, i) => {
      if (i === index) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    onChange({ ...user, education: updated });
  };

  const removeEducation = (index: number) => {
    const updated = education.filter((_, i) => i !== index);
    onChange({ ...user, education: updated });
  };

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={addEducation} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Education
      </Button>

      {education.map((edu, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div className="text-sm font-medium">Education {index + 1}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeEducation(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextField
              value={edu.institution || ""}
              onChange={(value) => updateEducation(index, "institution", value)}
              placeholder="Institution"
            />
            <TextField
              value={edu.degree || ""}
              onChange={(value) => updateEducation(index, "degree", value)}
              placeholder="Degree"
            />
            <TextField
              value={edu.field_of_study || ""}
              onChange={(value) =>
                updateEducation(index, "field_of_study", value)
              }
              placeholder="Field of Study"
            />
            <TextField
              value={edu.gpa || ""}
              onChange={(value) => updateEducation(index, "gpa", value)}
              placeholder="GPA (optional)"
            />
            <TextField
              value={edu.start_date || ""}
              onChange={(value) => updateEducation(index, "start_date", value)}
              placeholder="Start Date"
            />
            <TextField
              value={edu.end_date || ""}
              onChange={(value) => updateEducation(index, "end_date", value)}
              placeholder="End Date"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
