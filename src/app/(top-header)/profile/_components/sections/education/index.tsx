"use client";

import { EditableSection } from "~/app/(top-header)/profile/_components/editable-section";
import { updateProfileEducation } from "~/app/(top-header)/profile/_actions/update-profile";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";
import { EducationView } from "~/app/(top-header)/profile/_components/sections/education/education-view";
import { EducationEdit } from "~/app/(top-header)/profile/_components/sections/education/education-edit";
import { api } from "~/trpc/react";
import { type User } from "~/server/db/schemas/users";

export const ProfileEducation = () => {
  const userProfile = api.user.getProfile.useQuery();

  const updateProfileHeaderMutation = api.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Header updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSave = async (data: User) => {
    updateProfileHeaderMutation.mutate(data);
  };

  if (!userProfile.data) {
    return null;
  }

  return (
    <EditableSection
      title="Education"
      data={userProfile.data}
      renderView={(data) => <EducationView user={data} />}
      renderEdit={(data, onChange) => (
        <EducationEdit user={data} onChange={onChange} />
      )}
      onSave={handleSave}
      icon={<GraduationCap className="h-4 w-4" />}
    />
  );
};
