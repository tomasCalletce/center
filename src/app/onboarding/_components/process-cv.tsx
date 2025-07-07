"use client";

import Link from "next/link";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import {
  Loader2,
  Brain,
  FileText,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { mainOnboardingTask } from "~/server/trigger/cv-processing/main-onboarding-task";
import { ONBOARDING_PROGRESS } from "~/types/onboarding";
import { buttonVariants } from "~/components/ui/button";
import { useRouter } from "next/navigation";

const getProgressIcon = (status: string) => {
  switch (status) {
    case ONBOARDING_PROGRESS.CONVERTING_PDF_TO_IMAGES:
      return "📄";
    case ONBOARDING_PROGRESS.CONVERTING_IMAGES_TO_MARKDOWN:
      return "👁️";
    case ONBOARDING_PROGRESS.CONSOLIDATING_MARKDOWN:
      return "📝";
    case ONBOARDING_PROGRESS.EXTRACTING_JSON_STRUCTURE_AND_SAVING_TO_DATABASE:
      return "🧠";
    default:
      return "⚡";
  }
};

interface ProcessCVProps {
  publicAccessToken: string;
  runId: string;
}

const getProgressMessage = (status: string) => {
  switch (status) {
    case ONBOARDING_PROGRESS.CONVERTING_PDF_TO_IMAGES:
      return "Breaking down your CV into pages...";
    case ONBOARDING_PROGRESS.CONVERTING_IMAGES_TO_MARKDOWN:
      return "Reading and extracting content...";
    case ONBOARDING_PROGRESS.CONSOLIDATING_MARKDOWN:
      return "Organizing your information...";
    case ONBOARDING_PROGRESS.EXTRACTING_JSON_STRUCTURE_AND_SAVING_TO_DATABASE:
      return "Analyzing your experience and skills...";
    default:
      return "Processing your CV...";
  }
};

export const ProcessCV = ({ publicAccessToken, runId }: ProcessCVProps) => {
  const router = useRouter();
  const { run, error } = useRealtimeRun<typeof mainOnboardingTask>(runId, {
    accessToken: publicAccessToken,
    onComplete: () => {
      router.push("/");
    },
  });

  if (error) {
    return (
      <div className="w-md">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <h2 className="text-base font-semibold">Processing Failed</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Something went wrong while processing your CV
          </p>
        </div>

        <div className="rounded-md bg-destructive/5 p-4 border border-destructive/20 mb-4">
          <p className="text-sm text-destructive">
            We encountered an error while analyzing your CV. You can skip this
            step and set up your profile manually.
          </p>
        </div>

        <Link
          className={buttonVariants({
            variant: "outline",
            className: "w-full",
          })}
          href="/"
        >
          Skip to Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="w-md">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">Processing Your CV</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Getting ready to analyze your experience
          </p>
        </div>

        <div className="rounded-md bg-muted/50 p-6 border border-border mb-4">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">
            Initializing...
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
      : "Processing your CV...";

  const progressIcon = getProgressIcon(statusMessage);
  const progressMessage = getProgressMessage(statusMessage);

  if (isCompleted) {
    return (
      <div className="w-md">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">CV Analysis Complete</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Your profile has been successfully analyzed
          </p>
        </div>

        <div className="rounded-md bg-primary/5 p-6 border border-primary/20 mb-4">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <p className="text-center text-sm font-medium text-primary">
            All done! Your profile is ready.
          </p>
        </div>

        <Link
          className={buttonVariants({
            variant: "default",
            className: "w-full",
          })}
          href="/"
        >
          Continue to Challenges
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
          <h2 className="text-base font-semibold">Processing Your CV</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          This usually takes about a minute
        </p>
      </div>

      <div className="rounded-md bg-muted/50 p-6 border border-border mb-4">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">{progressIcon}</span>
          </div>
        </div>

        <div className="flex items-center justify-center mb-3">
          <Loader2 className="w-4 h-4 animate-spin text-primary mr-2" />
          <p className="text-sm font-medium">{progressMessage}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/60 backdrop-blur-sm mb-4">
        <div className="flex-shrink-0">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
            <FileText className="w-3 h-3 text-blue-600" />
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          We're analyzing your CV to extract skills, experience, and education
          to create your personalized profile.
        </p>
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
