"use client";

import { EditableSection } from "~/app/(top-header)/profile/_components/editable-section";
import { updateProfileEducation } from "~/app/(top-header)/profile/_actions/update-profile";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";
import { EducationView } from "~/app/(top-header)/profile/_components/sections/education/education-view";
import { EducationEdit } from "~/app/(top-header)/profile/_components/sections/education/education-edit";

interface Education {
  institution?: string | null;
  degree?: string | null;
  field_of_study?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  gpa?: string | null;
}

interface ProfileEducationProps {
  education?: Education[] | null;
}

export const ProfileEducation = ({ education }: ProfileEducationProps) => {
  const educationData = education || [];

  const handleSave = async (data: Education[]) => {
    const result = await updateProfileEducation(data);
    if (result.error) {
      toast.error(result.error);
      throw new Error(result.error);
    }
    toast.success("Education updated successfully!");
  };

  return (
    <EditableSection
      title="Education"
      data={educationData}
      renderView={(data) => <EducationView education={data} />}
      renderEdit={(data, onChange) => (
        <EducationEdit education={data} onChange={onChange} />
      )}
      onSave={handleSave}
      icon={<GraduationCap className="h-4 w-4" />}
    />
  );
}; 