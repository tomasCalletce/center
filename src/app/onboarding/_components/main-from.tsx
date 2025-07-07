"use client";

import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { UploadCV } from "~/app/onboarding/_components/upload-cv";
import { ProcessCV } from "~/app/onboarding/_components/process-cv";
import { ONBOARDING_STATUS } from "~/types/onboarding";
import { useState } from "react";

export function MainOnboardingForm() {
  const { user, isLoaded } = useUser();
  const [triggerTask, setTriggerTask] = useState<{
    publicAccessToken: string;
    runId: string;
  } | null>(null);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const onComplete = (triggerTask: {
    publicAccessToken: string;
    runId: string;
  }) => {
    setTriggerTask(triggerTask);
  };

  return (
    <div>
      {!triggerTask && user.publicMetadata.onboardingStatus === undefined && (
        <UploadCV onComplete={onComplete} />
      )}
      {triggerTask && (
        <ProcessCV
          publicAccessToken={triggerTask.publicAccessToken}
          runId={triggerTask.runId}
        />
      )}
    </div>
  );
}
