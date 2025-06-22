"use client";

import { useState } from "react";
import { useQueryState, parseAsStringEnum } from "nuqs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { submissionVisibilityValues } from "~/server/db/schemas/submissions";
import { api } from "~/trpc/react";
import { SubmissionMarkdownStep } from "~/app/(top-header)/challenges/[slug]/_components/submission-markdown-step";
import { SubmissionResultStep } from "~/app/(top-header)/challenges/[slug]/_components/submission-result-step";
import { SubmissionDetailsStep } from "~/app/(top-header)/challenges/[slug]/_components/submission-details-step";

enum SUBMISSION_STEPS {
  DETAILS = "details",
  MARKDOWN = "markdown",
  SUCCESS = "success",
  ERROR = "error",
}

const stepEnum = parseAsStringEnum(Object.values(SUBMISSION_STEPS));

interface SubmissionDialogProps {
  challengeId: string;
  children: React.ReactNode;
}

export function SubmissionDialog({
  challengeId,
  children,
}: SubmissionDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useQueryState(
    "step",
    stepEnum.withDefault(SUBMISSION_STEPS.DETAILS)
  );

  const [detailsData, setDetailsData] = useState<{
    title: string;
    demo_url: string;
    repository_url: string;
    image: {
      url: string;
      pathname: string;
      alt: string;
    } | null;
  }>({
    title: "",
    demo_url: "",
    repository_url: "",
    image: null,
  });

  const [markdownData, setMarkdownData] = useState<{
    description: string;
  }>({
    description: "",
  });

  const submitMutation = api.submission.create.useMutation({
    onSuccess: () => {
      setStep(SUBMISSION_STEPS.SUCCESS);
    },
    onError: (error) => {
      setStep(SUBMISSION_STEPS.ERROR);
    },
  });

  const handleDetailsSubmit = (data: typeof detailsData) => {
    setDetailsData(data);
    setStep(SUBMISSION_STEPS.MARKDOWN);
  };

  const handleMarkdownSubmit = (data: typeof markdownData) => {
    setMarkdownData(data);

    // Submit the complete form data
    submitMutation.mutate({
      _challenge: challengeId,
      title: detailsData.title,
      description: data.description,
      demo_url: detailsData.demo_url,
      repository_url: detailsData.repository_url,
      status: submissionVisibilityValues.VISIBLE,
      verifyImagesSchema: detailsData.image
        ? {
            alt: detailsData.image.alt,
            verifyAssetsSchema: {
              url: detailsData.image.url,
              pathname: detailsData.image.pathname,
            },
          }
        : {
            alt: "",
            verifyAssetsSchema: {
              url: "",
              pathname: "",
            },
          },
    });
  };

  const handleBack = () => {
    if (step === "markdown") {
      setStep(SUBMISSION_STEPS.DETAILS);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset to first step when dialog closes
      setStep(SUBMISSION_STEPS.DETAILS);
      setDetailsData({
        title: "",
        demo_url: "",
        repository_url: "",
        image: null,
      });
      setMarkdownData({ description: "" });
    }
  };

  const getStepNumber = () => {
    switch (step) {
      case "details":
        return 1;
      case "markdown":
        return 2;
      case "success":
      case "error":
        return 3;
      default:
        return 1;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="!max-w-[1100px]">
        <DialogHeader>
          <DialogTitle>Submit Your Build</DialogTitle>
          <DialogDescription>
            Submit your project for this challenge in{" "}
            {getStepNumber() === 3 ? "3" : "2"} simple steps
          </DialogDescription>
          <div className="">
            <div className="flex items-center gap-3">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      stepNum < getStepNumber()
                        ? "bg-primary text-primary-foreground"
                        : stepNum === getStepNumber()
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div
                      className={`w-12 h-0.5 transition-all ${
                        stepNum < getStepNumber() ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogHeader>
        <div>
          {step === "details" && (
            <SubmissionDetailsStep
              initialData={detailsData}
              onSubmit={handleDetailsSubmit}
            />
          )}
          {step === "markdown" && (
            <SubmissionMarkdownStep
              initialData={markdownData}
              onSubmit={handleMarkdownSubmit}
              onBack={handleBack}
              isLoading={submitMutation.isPending}
            />
          )}
          {(step === "success" || step === "error") && (
            <SubmissionResultStep
              success={step === "success"}
              onClose={() => handleOpenChange(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
