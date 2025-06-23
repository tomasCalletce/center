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
import { api } from "~/trpc/react";
import { SubmissionMarkdownStep } from "~/app/(top-header)/challenges/[slug]/_components/submission-markdown-step";
import { SubmissionResultStep } from "~/app/(top-header)/challenges/[slug]/_components/submission-result-step";
import { SubmissionDetailsStep } from "~/app/(top-header)/challenges/[slug]/_components/submission-details-step";
import { formSubmissionSchema } from "~/server/db/schemas/submissions";
import { submissionVisibilityValues } from "~/server/db/schemas/submissions";
import { z } from "zod";

export enum SUBMISSION_STEPS {
  DETAILS = "details",
  MARKDOWN = "markdown",
  SUCCESS = "success",
  ERROR = "error",
}

type SubmissionDetailsSchema = z.infer<typeof formSubmissionSchema>;
export type DetailsData = {
  title: SubmissionDetailsSchema["title"];
  demo_url: SubmissionDetailsSchema["demo_url"];
  repository_url: SubmissionDetailsSchema["repository_url"];
  image: {
    alt: SubmissionDetailsSchema["formImagesSchema"]["alt"];
    url: SubmissionDetailsSchema["formImagesSchema"]["formAssetsSchema"]["url"];
    pathname: SubmissionDetailsSchema["formImagesSchema"]["formAssetsSchema"]["pathname"];
  };
};
export type MarkdownData = {
  markdown: SubmissionDetailsSchema["markdown"];
};

const stepEnum = parseAsStringEnum(Object.values(SUBMISSION_STEPS));

interface SubmissionDialogProps {
  _challenge: string;
  children: React.ReactNode;
}

export function SubmissionDialog({
  _challenge,
  children,
}: SubmissionDialogProps) {
  const [step, setStep] = useQueryState(
    "step",
    stepEnum.withDefault(SUBMISSION_STEPS.DETAILS)
  );

  const [detailsData, setDetailsData] = useState<DetailsData | null>(null);

  const submitMutation = api.submission.create.useMutation({
    onSuccess: () => {
      setStep(SUBMISSION_STEPS.SUCCESS);
    },
    onError: () => {
      setStep(SUBMISSION_STEPS.ERROR);
    },
  });

  const handleDetailsSubmit = (data: DetailsData) => {
    setDetailsData({
      title: data.title,
      demo_url: data.demo_url,
      repository_url: data.repository_url,
      image: data.image,
    });
    setStep(SUBMISSION_STEPS.MARKDOWN);
  };

  const handleMarkdownSubmit = (data: MarkdownData) => {
    if (!detailsData) return;
    submitMutation.mutate({
      _challenge: _challenge,
      title: detailsData.title,
      demo_url: detailsData.demo_url,
      repository_url: detailsData.repository_url,
      markdown: data.markdown,
      status: submissionVisibilityValues.VISIBLE,
      verifyImagesSchema: {
        alt: detailsData.image.alt,
        _asset: detailsData.image.url,
        verifyAssetsSchema: {
          pathname: detailsData.image.pathname,
          url: detailsData.image.url,
        },
      },
    });
  };

  const handleBack = () => {
    if (step === SUBMISSION_STEPS.MARKDOWN) {
      setStep(SUBMISSION_STEPS.DETAILS);
    }
  };

  const getStepNumber = () => {
    switch (step) {
      case SUBMISSION_STEPS.DETAILS:
        return 1;
      case SUBMISSION_STEPS.MARKDOWN:
        return 2;
      case SUBMISSION_STEPS.SUCCESS:
      case SUBMISSION_STEPS.ERROR:
        return 3;
      default:
        return 1;
    }
  };

  return (
    <Dialog>
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
          {step === SUBMISSION_STEPS.DETAILS && (
            <SubmissionDetailsStep handleOnSubmit={handleDetailsSubmit} />
          )}
          {step === "markdown" && (
            <SubmissionMarkdownStep
              handleOnSubmit={handleMarkdownSubmit}
              onBack={handleBack}
              isLoading={submitMutation.isPending}
            />
          )}
          {(step === SUBMISSION_STEPS.SUCCESS ||
            step === SUBMISSION_STEPS.ERROR) && (
            <SubmissionResultStep type={step} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
