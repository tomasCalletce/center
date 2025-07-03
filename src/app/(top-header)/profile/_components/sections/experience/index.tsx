"use client";

import { EditableSection } from "~/app/(top-header)/profile/_components/editable-section";
import { updateProfileExperience } from "~/app/(top-header)/profile/_actions/update-profile";
import { toast } from "sonner";
import { Briefcase } from "lucide-react";
import { ExperienceView } from "~/app/(top-header)/profile/_components/sections/experience/experience-view";
import { ExperienceEdit } from "~/app/(top-header)/profile/_components/sections/experience/experience-edit";
import { api } from "~/trpc/react";
import { type User } from "~/server/db/schemas/users";

export const ProfileExperience = () => {
  const userProfile = api.user.getProfile.useQuery();

  const updateProfileExperienceMutation = api.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Header updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSave = async (data: User) => {
    updateProfileExperienceMutation.mutate(data);
  };

  if (!userProfile.data) {
    return null;
  }

  return (
    <EditableSection
      title="Experience"
      data={userProfile.data}
      renderView={(data) => (
        <ExperienceView experience={data.experience || []} />
      )}
      renderEdit={(data, onChange) => (
        <ExperienceEdit experience={data} onChange={onChange} />
      )}
      onSave={handleSave}
      icon={<Briefcase className="h-4 w-4" />}
    />
  );
};
