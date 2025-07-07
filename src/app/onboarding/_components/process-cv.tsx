"use client";

import Link from "next/link";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { mainOnboardingTask } from "~/server/trigger/cv-processing/main-onboarding-task";

interface ProcessCVProps {
  publicAccessToken: string;
  runId: string;
}

export const ProcessCV = ({ publicAccessToken, runId }: ProcessCVProps) => {
  const { run, error } = useRealtimeRun<typeof mainOnboardingTask>(runId, {
    accessToken: publicAccessToken,
  });

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">
            Please try again later
          </p>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href="/">Skip</Link>
        </Button>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-6">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
          <p className="text-sm">Getting started...</p>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href="/">Skip</Link>
        </Button>
      </div>
    );
  }

  const progressMessage =
    typeof run.metadata?.status === "string"
      ? run.metadata.status
      : "Processing your CV...";

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="mb-6">
        <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
        <p className="text-sm">{progressMessage}</p>
      </div>

      <Button asChild variant="outline" className="w-full">
        <Link href="/">Skip</Link>
      </Button>
    </div>
  );
};
