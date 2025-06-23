"use client";

import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { X, Plus } from "lucide-react";
import { employmentTypeEnum } from "~/server/db/schemas/users";
import { TextField } from "../form-controls/text-field";
import { SkillsField } from "../form-controls/skills-field";
import { type ExperienceItem } from "../types/profile-types";

interface ExperienceFieldProps {
  experience: ExperienceItem[];
  onChange: (experience: ExperienceItem[]) => void;
}

export const ExperienceField = ({ experience, onChange }: ExperienceFieldProps) => {
  const employmentTypes = employmentTypeEnum.options;
  const defaultEmploymentType = employmentTypes[0]; // "full-time"
  
  const formatEmploymentType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('-');
  };

  const addExperience = () => {
    const newExperience: ExperienceItem = {
      title: "",
      company: "",
      employment_type: defaultEmploymentType,
      start_date: "",
      end_date: "",
      description: "",
      skills_used: []
    };
    const updatedExperience = [newExperience];
    experience.forEach(exp => updatedExperience.push(exp));
    onChange(updatedExperience);
  };

  const updateExperience = (index: number, field: keyof ExperienceItem, value: any) => {
    const updated = experience.map((exp, i) => {
      if (i === index) {
        const updatedExp = Object.assign({}, exp);
        (updatedExp as any)[field] = value;
        return updatedExp;
      }
      return exp;
    });
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    onChange(experience.filter((_, i) => i !== index));
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
            <TextField
              value={exp.title || ""}
              onChange={(value) => updateExperience(index, "title", value)}
              placeholder="Job Title"
            />
            <TextField
              value={exp.company || ""}
              onChange={(value) => updateExperience(index, "company", value)}
              placeholder="Company"
            />
            <div>
              <Select
                value={exp.employment_type || defaultEmploymentType}
                onValueChange={(value) => updateExperience(index, "employment_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  {employmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {formatEmploymentType(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <TextField
              value={exp.start_date || ""}
              onChange={(value) => updateExperience(index, "start_date", value)}
              placeholder="Start Date"
            />
            <TextField
              value={exp.end_date || ""}
              onChange={(value) => updateExperience(index, "end_date", value)}
              placeholder="End Date"
            />
          </div>
          
          <TextField
            value={exp.description || ""}
            onChange={(value) => updateExperience(index, "description", value)}
            placeholder="Job Description"
            multiline
          />
          
          <SkillsField
            skills={exp.skills_used || []}
            onChange={(skills) => updateExperience(index, "skills_used", skills)}
          />
        </div>
      ))}
    </div>
  );
}; 