"use client";

import { User } from "lucide-react";
import { EditableSection } from "~/app/(top-header)/profile/_components/editable-section";
import { updateProfileHeader } from "~/app/(top-header)/profile/_actions/update-profile";
import { toast } from "sonner";
import { ProfileHeaderEdit } from "~/app/(top-header)/profile/_components/sections/header/header-edit";
import { ProfileHeaderView } from "~/app/(top-header)/profile/_components/sections/header/header-view";
import { type UserProfile } from "~/app/(top-header)/profile/_components/types/profile-types";

interface ProfileHeaderProps {
  user: UserProfile;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const handleSave = async (data: Partial<UserProfile>) => {
    
    const headerData = {
      display_name: data.display_name ?? undefined,
      location: data.location ?? undefined,
      current_title: data.current_title ?? undefined,
      social_links: data.social_links ?? undefined,
    };

    const result = await updateProfileHeader(headerData);
    if (result.error) {
      toast.error(result.error);
      throw new Error(result.error);
    }
    toast.success("Header updated successfully!");
  };

  return (
    <EditableSection
      title={user.display_name || "Profile Header"}
      data={user}
      renderView={(data) => (
        <ProfileHeaderView data={data} experience={user.experience} />
      )}
      renderEdit={(data, onChange) => (
        <ProfileHeaderEdit data={data} onChange={onChange} />
      )}
      onSave={handleSave}
      icon={<User className="h-4 w-4" />}
    />
  );
}; 