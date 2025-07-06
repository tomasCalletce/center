"use client";

import Link from "next/link";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { Button } from "~/components/ui/button";
import { CheckCircle, Loader2, Ship } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProcessCVProps {
  publicAccessToken: string;
  runId: string;
}

const getStatusMessage = (status: string, taskIdentifier?: string) => {
  if (status === "COMPLETED") {
    return "✅ All done!";
  }

  if (taskIdentifier === "onboarding.split-pdf-to-images") {
    return "📄 Breaking down your CV...";
  }

  if (taskIdentifier === "onboarding.image-to-markdown") {
    return "👁️ Reading your CV...";
  }

  if (taskIdentifier === "onboarding.consolidated-markdown") {
    return "📝 Organizing your content...";
  }

  if (taskIdentifier === "onboarding.extract-json-structure") {
    return "🧠 Analyzing your experience...";
  }

  return "⚡ Processing your CV...";
};

export const ProcessCV = ({ publicAccessToken, runId }: ProcessCVProps) => {
  const router = useRouter();

  const { run, error } = useRealtimeRun(runId, {
    accessToken: publicAccessToken,
    onComplete: async (error) => {
      if (error) {
        console.error("Error", error);
      }
      router.push("/");
    },
  });

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">Please try again</p>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href="/">Go back</Link>
        </Button>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
        <p className="text-sm">Getting started...</p>
      </div>
    );
  }

  const isCompleted = run.status === "COMPLETED";
  const message = getStatusMessage(run.status, run.taskIdentifier);

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="mb-6">
        {isCompleted ? (
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
        ) : (
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
        )}

        <h2 className="text-lg font-semibold mb-2">{message}</h2>

        {!isCompleted && (
          <p className="text-sm text-muted-foreground">
            This usually takes about a minute
          </p>
        )}
      </div>

      {/* Debug info */}
      <div className="mb-4 p-2 bg-muted rounded text-xs">
        <p>Status: {run.status}</p>
        <p>Task ID: {run.taskIdentifier || "None"}</p>
      </div>

      <Button asChild className="w-full" disabled={!isCompleted}>
        <Link href="/">
          <Ship className="w-4 h-4 mr-2" />
          {isCompleted ? "Continue" : "Processing..."}
        </Link>
      </Button>
    </div>
  );
};
