"use client";

import { Button } from "~/components/ui/button";
import { X, Plus } from "lucide-react";
import { TextField } from "../form-controls/text-field";
import { type EducationItem } from "../types/profile-types";

interface EducationFieldProps {
  education: EducationItem[];
  onChange: (education: EducationItem[]) => void;
}

export const EducationField = ({ education, onChange }: EducationFieldProps) => {
  const addEducation = () => {
    const newEducation: EducationItem = {
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      gpa: ""
    };
    const updatedEducation = [newEducation];
    education.forEach(edu => updatedEducation.push(edu));
    onChange(updatedEducation);
  };

  const updateEducation = (index: number, field: keyof EducationItem, value: any) => {
    const updated = education.map((edu, i) => {
      if (i === index) {
        const updatedEdu = Object.assign({}, edu);
        (updatedEdu as any)[field] = value;
        return updatedEdu;
      }
      return edu;
    });
    onChange(updated);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
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
              onChange={(value) => updateEducation(index, "field_of_study", value)}
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