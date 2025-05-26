"use client";

import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { UploadCV } from "~/app/onboarding/_components/upload-cv";
import { ONBOARDING_STATUS } from "~/types/onboarding";

export function MainOnboardingForm() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      {user.publicMetadata.onboardingStatus === undefined && <UploadCV />}
    </div>
  );
}
