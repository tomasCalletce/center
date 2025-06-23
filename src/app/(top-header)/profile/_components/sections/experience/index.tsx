"use client";

import { EditableSection } from "~/app/(top-header)/profile/_components/editable-section";
import { updateProfileExperience } from "~/app/(top-header)/profile/_actions/update-profile";
import { toast } from "sonner";
import { type EmploymentType } from "~/server/db/schemas/users";
import { Briefcase } from "lucide-react";
import { ExperienceView } from "~/app/(top-header)/profile/_components/sections/experience/experience-view";
import { ExperienceEdit } from "~/app/(top-header)/profile/_components/sections/experience/experience-edit";

interface Experience {
  title?: string | null;
  company?: string | null;
  employment_type?: EmploymentType | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  skills_used?: string[] | null;
}

interface ProfileExperienceProps {
  experience?: Experience[] | null;
}

export const ProfileExperience = ({ experience }: ProfileExperienceProps) => {
  const experienceData = experience || [];

  const handleSave = async (data: Experience[]) => {
    const result = await updateProfileExperience(data);
    if (result.error) {
      toast.error(result.error);
      throw new Error(result.error);
    }
    toast.success("Experience updated successfully!");
  };

  return (
    <EditableSection
      title="Experience"
      data={experienceData}
      renderView={(data) => <ExperienceView experience={data} />}
      renderEdit={(data, onChange) => (
        <ExperienceEdit experience={data} onChange={onChange} />
      )}
      onSave={handleSave}
      icon={<Briefcase className="h-4 w-4" />}
    />
  );
}; 