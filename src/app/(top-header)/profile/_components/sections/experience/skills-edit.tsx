"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Plus, X } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import type { UserExperience } from "~/server/db/schemas/users";

interface SkillsEditProps {
  experience: UserExperience;
  onUpdateSkills: (skills: string[]) => void;
}

export const SkillsEdit = ({ experience, onUpdateSkills }: SkillsEditProps) => {
  const [newSkill, setNewSkill] = useState("");
  const skills = experience.skills_used ?? [];

  const updateSkills = (newSkills: string[]) => {
    onUpdateSkills(newSkills);
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      updateSkills([...skills, trimmed]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700">Skills Used</div>
      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a skill used in this role..."
        />
        <Button onClick={addSkill} type="button">
          <Plus />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="ml-1 hover:text-destructive cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
