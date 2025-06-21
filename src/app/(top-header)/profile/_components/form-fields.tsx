"use client";

import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { X, Plus } from "lucide-react";
import { useState } from "react";

// Text Input Field
interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export const TextField = ({ value, onChange, placeholder, multiline }: TextFieldProps) => {
  if (multiline) {
    return (
      <Textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
    );
  }
  
  return (
    <Input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};

// Skills/Tags Field
interface SkillsFieldProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export const SkillsField = ({ skills, onChange }: SkillsFieldProps) => {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = skills.concat([newSkill.trim()]);
      onChange(updatedSkills);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a skill..."
          onKeyPress={(e) => e.key === "Enter" && addSkill()}
        />
        <Button size="sm" onClick={addSkill} type="button">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

// Experience Field
interface ExperienceItem {
  title?: string | null;
  company?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  skills_used?: string[] | null;
}

interface ExperienceFieldProps {
  experience: ExperienceItem[];
  onChange: (experience: ExperienceItem[]) => void;
}

export const ExperienceField = ({ experience, onChange }: ExperienceFieldProps) => {
  const addExperience = () => {
    const newExperience: ExperienceItem = {
      title: "",
      company: "",
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