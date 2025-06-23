"use client";

import { User } from "lucide-react";
import { EditableSection } from "./editable-section";
import { ProfileHeaderView, ProfileHeaderEdit } from "./profile-sections";
import { updateProfileHeader } from "../_actions/update-profile";
import { type SocialLink, type ProfileHeaderData } from "./types";

interface Experience {
  start_date?: string | null;
  end_date?: string | null;
}

interface ProfileHeaderProps {
  user: {
    display_name?: string | null;
    location?: string | null;
    current_title?: string | null;
    social_links?: Array<{ platform: string; url: string }> | null;
    experience?: Experience[] | null;
  };
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const headerData: ProfileHeaderData = {
    display_name: user.display_name ?? undefined,
    location: user.location ?? undefined,
    current_title: user.current_title ?? undefined,
    social_links: user.social_links?.map((link) => ({
      platform: link.platform as SocialLink["platform"],
      url: link.url
    })) || [],
  };

  const handleSave = async (data: ProfileHeaderData) => {
    const result = await updateProfileHeader(data);
    if (result.error) {
      throw new Error(result.error);
    }
  };

  return (
    <EditableSection
      title="Profile"
      data={headerData}
      icon={<User className="h-4 w-4" />}
      renderView={(data) => <ProfileHeaderView data={data} experience={user.experience} />}
      renderEdit={(data, onChange) => <ProfileHeaderEdit data={data} onChange={onChange} />}
      onSave={handleSave}
    />
  );
}; 