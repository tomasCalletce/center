"use client";

import { EditableSection } from "~/app/(top-header)/profile/_components/editable-section";
import { updateProfileSkills } from "~/app/(top-header)/profile/_actions/update-profile";
import { toast } from "sonner";
import { Code2 } from "lucide-react";
import { SkillsView } from "~/app/(top-header)/profile/_components/sections/skills/skills-view";
import { SkillsEdit } from "~/app/(top-header)/profile/_components/sections/skills/skills-edit";

interface ProfileSkillsProps {
  skills?: string[] | null;
}

export const ProfileSkills = ({ skills }: ProfileSkillsProps) => {
  const skillsData = skills || [];

  const handleSave = async (data: string[]) => {
    const result = await updateProfileSkills(data);
    if (result.error) {
      toast.error(result.error);
      throw new Error(result.error);
    }
    toast.success("Skills updated successfully!");
  };

  return (
    <EditableSection
      title="Skills & Technologies"
      data={skillsData}
      renderView={(data) => <SkillsView skills={data} />}
      renderEdit={(data, onChange) => (
        <SkillsEdit skills={data} onChange={onChange} />
      )}
      onSave={handleSave}
      icon={<Code2 className="h-4 w-4" />}
    />
  );
}; 