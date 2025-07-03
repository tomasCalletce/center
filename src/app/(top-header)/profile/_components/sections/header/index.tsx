"use client";

import { User as UserIcon } from "lucide-react";
import { EditableSection } from "~/app/(top-header)/profile/_components/editable-section";
import { toast } from "sonner";
import { ProfileHeaderEdit } from "~/app/(top-header)/profile/_components/sections/header/header-edit";
import { ProfileHeaderView } from "~/app/(top-header)/profile/_components/sections/header/header-view";
import { type User } from "~/server/db/schemas/users";
import { api } from "~/trpc/react";

export const ProfileHeader = () => {
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
      title={userProfile.data.display_name ?? "ACC Cracked Competitor"}
      data={userProfile.data}
      renderView={(data) => (
        <ProfileHeaderView data={data} experience={data.experience} />
      )}
      renderEdit={(data, onChange) => (
        <ProfileHeaderEdit data={data} onChange={onChange} />
      )}
      onSave={handleSave}
      icon={<UserIcon className="h-4 w-4" />}
    />
  );
};
