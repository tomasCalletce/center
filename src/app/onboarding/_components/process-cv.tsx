"use client";

import Link from "next/link";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import {
  Loader2,
  Brain,
  AlertCircle,
  ArrowRight,
  Upload,
  Trophy,
  Camera,
} from "lucide-react";
import { CodeTypingGame } from "~/app/onboarding/_components/code-typing-game";
import { mainOnboardingTask } from "~/server/trigger/cv-processing/main-onboarding-task";
import { ONBOARDING_PROGRESS } from "~/types/onboarding";
import { Button, buttonVariants } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface ProcessCVProps {
  publicAccessToken: string;
  runId: string;
  onRetry: () => void;
}

interface FinalResults {
  wpm: number;
  accuracy: number;
  snippetsCompleted: number;
  timestamp: number;
}

const getProgressMessage = (status: string) => {
  switch (status) {
    case ONBOARDING_PROGRESS.VALIDATING_CV:
      return "Analyzing your CV...";
    case ONBOARDING_PROGRESS.CONVERTING_PDF_TO_IMAGES:
      return "Reading through your experience...";
    case ONBOARDING_PROGRESS.CONVERTING_IMAGES_TO_MARKDOWN:
      return "Analyzing your skills and background...";
    case ONBOARDING_PROGRESS.CONSOLIDATING_MARKDOWN:
      return "Connecting the dots in your career...";
    case ONBOARDING_PROGRESS.EXTRACTING_JSON_STRUCTURE_AND_SAVING_TO_DATABASE:
      return "Building your professional profile...";
    default:
      return "Getting to know your background...";
  }
};

export const ProcessCV = ({
  publicAccessToken,
  runId,
  onRetry,
}: ProcessCVProps) => {
  const router = useRouter();
  const gameResultsRef = useRef<FinalResults | null>(null);
  const [hasGameResults, setHasGameResults] = useState(false);

  const { run, error } = useRealtimeRun<typeof mainOnboardingTask>(runId, {
    accessToken: publicAccessToken,
    onComplete(run, err) {
      if (err) {
        if (isCvValidationError(err.message)) {
          return;
        }
        toast.error(
          "Something went wrong processing your CV. Please try again."
        );
        onRetry();
      } else {
        router.push("/");
      }
    },
  });

  const updateGameResults = (results: FinalResults | null) => {
    gameResultsRef.current = results;
    setHasGameResults(results !== null);
  };

  const isCvValidationError = (errorMessage?: string) => {
    if (!errorMessage) return false;
    return errorMessage.includes("This document does not appear to be a CV") ||
           errorMessage.includes("CV validation failed");
  };

  const currentError = error?.message || (run?.status === "FAILED" ? run?.error?.message : undefined);

  if (isCvValidationError(currentError)) {
    return (
      <div className="w-md">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <h2 className="text-base font-semibold">That's not a CV</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            We couldn't find the usual CV stuff in there
          </p>
        </div>

        <Button onClick={onRetry} className="flex-1" variant="default">
          <Upload className="w-4 h-4 mr-2" />
          Try Another CV
        </Button>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="w-md">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">Getting Started</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Setting things up to analyze your experience
          </p>
        </div>

        <div className="rounded-md bg-muted/50 p-3 border border-border mb-4">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">
            Just a sec...
          </p>
        </div>

        <Link
          className={buttonVariants({
            variant: "outline",
            className: "w-full",
          })}
          href="/"
        >
          Skip
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const isCompleted = run.status === "COMPLETED";
  const statusMessage =
    typeof run.metadata?.status === "string"
      ? run.metadata.status
      : "Getting to know your background...";

  const progressMessage = getProgressMessage(statusMessage);

  if (isCompleted) {
    return (
      <div className="w-md">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">All Set!</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Your profile is ready to go
          </p>
        </div>

        <div className="rounded-md bg-primary/5 p-3 border border-primary/20 mb-4">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-center text-sm font-medium text-primary">
            We've analyzed your experience and you're ready to roll!
          </p>
        </div>

        {hasGameResults && gameResultsRef.current && (
          <div className="rounded-md bg-slate-50 p-3 border border-slate-200/60 mb-4">
            <div className="text-center mb-4">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-slate-600" />
                Your Final Score
              </h4>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {gameResultsRef.current.wpm}
                  </div>
                  <div className="text-xs text-slate-600">WPM</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {gameResultsRef.current.accuracy}%
                  </div>
                  <div className="text-xs text-slate-600">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {gameResultsRef.current.snippetsCompleted}
                  </div>
                  <div className="text-xs text-slate-600">Snippets</div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 p-2 bg-slate-900 text-white rounded-lg animate-pulse">
                <Camera className="w-4 h-4 text-white" />
                <span className="text-sm font-medium">
                  Screenshot this and invite your friends!
                </span>
              </div>

              <p className="text-xs text-slate-600">
                Join the coding community where skills matter more than words 💻
              </p>
            </div>
          </div>
        )}

        <Link
          className={buttonVariants({
            variant: "default",
            className: "w-full",
          })}
          href="/"
        >
          Let's Go
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-md">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">Analyzing Your CV</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          This usually takes about a minute
        </p>
      </div>

      <CodeTypingGame onResultsUpdate={updateGameResults} />

      <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/60 backdrop-blur-sm mb-4">
        <div className="flex items-center justify-center mr-2">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {progressMessage}
          </p>
          <p className="text-xs text-slate-500">
            While you wait, improve your coding speed above!
          </p>
        </div>
      </div>

      <Link
        className={buttonVariants({ variant: "outline", className: "w-full" })}
        href="/"
      >
        Skip
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
