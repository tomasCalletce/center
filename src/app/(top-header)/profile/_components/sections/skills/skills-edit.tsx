"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Plus, X } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import type { User } from "~/server/db/schemas/users";

interface SkillsEditProps {
  user: User;
  onChange: (user: User) => void;
}

export const SkillsEdit = ({ user, onChange }: SkillsEditProps) => {
  const [newSkill, setNewSkill] = useState("");
  const skills = user.skills ?? [];

  const updateSkills = (newSkills: string[]) => {
    onChange({ ...user, skills: newSkills });
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
      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a skill..."
        />
        <Button size="sm" onClick={addSkill} type="button">
          <Plus className="h-4 w-4" />
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
