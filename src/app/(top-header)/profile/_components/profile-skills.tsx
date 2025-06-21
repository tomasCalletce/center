"use client";

import { Badge } from "~/components/ui/badge";
import { EditableSection } from "./editable-section";
import { SkillsField } from "./form-fields";
import { updateProfileSkills } from "../_actions/update-profile";
import { toast } from "sonner";

interface ProfileSkillsProps {
  skills?: string[] | null;
}

export const ProfileSkills = ({ skills }: ProfileSkillsProps) => {
  const skillsData = skills || [];

  const renderView = (data: string[]) => {
    if (data.length === 0) {
      return <p className="text-muted-foreground">No skills listed</p>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {data.map((skill, index) => (
          <Badge key={index} variant="secondary">
            {skill}
          </Badge>
        ))}
      </div>
    );
  };

  const renderEdit = (data: string[], onChange: (data: string[]) => void) => {
    return <SkillsField skills={data} onChange={onChange} />;
  };

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
      renderView={renderView}
      renderEdit={renderEdit}
      onSave={handleSave}
    />
  );
}; 