"use client";

import { EditableSection } from "~/app/(top-header)/profile/_components/editable-section";
import { toast } from "sonner";
import { Code2 } from "lucide-react";
import { SkillsView } from "~/app/(top-header)/profile/_components/sections/skills/skills-view";
import { SkillsEdit } from "~/app/(top-header)/profile/_components/sections/skills/skills-edit";
import { api } from "~/trpc/react";
import type { User } from "~/server/db/schemas/users";

export const ProfileSkills = () => {
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
      title="Skills & Technologies"
      data={userProfile.data}
      renderView={(data) => <SkillsView user={data} />}
      renderEdit={(data, onChange) => (
        <SkillsEdit user={data} onChange={onChange} />
      )}
      onSave={handleSave}
      icon={<Code2 className="h-4 w-4" />}
    />
  );
};
