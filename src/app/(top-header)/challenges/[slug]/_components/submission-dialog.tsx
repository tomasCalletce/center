"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
    alt: SubmissionDetailsSchema["formAssetsImageSchema"]["alt"];
    url: SubmissionDetailsSchema["formAssetsImageSchema"]["formAssetsSchema"]["url"];
    pathname: SubmissionDetailsSchema["formAssetsImageSchema"]["formAssetsSchema"]["pathname"];
  };
};
export type MarkdownData = {
  markdown: SubmissionDetailsSchema["markdown"];
};

interface SubmissionDialogProps {
  _challenge: string;
  children: React.ReactNode;
}

export function SubmissionDialog({
  _challenge,
  children,
}: SubmissionDialogProps) {
  const [step, setStep] = useState(SUBMISSION_STEPS.DETAILS);

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
      verifyAssetsImageSchema: {
        alt: detailsData.image.alt,
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
      <DialogContent className="!max-w-[1100px] min-h-[700px]">
        <DialogHeader>
          <DialogTitle>Submit Your Build</DialogTitle>
          <DialogDescription>
            Submit your project for this challenge.
          </DialogDescription>
          <div className="relative">
            <div className="flex items-center justify-between max-w-xs mx-auto">
              {[
                { num: 1, label: "Details", icon: "📝" },
                { num: 2, label: "Description", icon: "📋" },
                { num: 3, label: "Submit", icon: "🚀" },
              ].map((step) => (
                <div
                  key={step.num}
                  className="flex flex-col items-center relative z-10"
                >
                  <div
                    className={`
                      relative w-12 h-12 rounded-xl flex items-center justify-center text-sm font-medium 
                      transition-all duration-300 border-2 group
                      ${
                        step.num < getStepNumber()
                          ? "bg-slate-900 border-slate-900 text-white shadow-lg scale-105"
                          : step.num === getStepNumber()
                          ? "bg-slate-900 border-slate-900 text-white shadow-lg scale-105 ring-4 ring-slate-900/20"
                          : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                      }
                    `}
                  >
                    <span className="text-lg leading-none">
                      {step.num < getStepNumber()
                        ? "✓"
                        : step.num === getStepNumber()
                        ? step.icon
                        : step.num}
                    </span>
                  </div>
                  <div
                    className={`
                    mt-2 text-xs font-medium transition-colors duration-200
                    ${
                      step.num <= getStepNumber()
                        ? "text-slate-900"
                        : "text-slate-400"
                    }
                  `}
                  >
                    {step.label}
                  </div>
                </div>
              ))}

              {/* Connecting line */}
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-gradient-to-r from-slate-200 via-slate-200 to-slate-200 -z-0">
                <div
                  className={`
                    h-full bg-gradient-to-r from-slate-900 to-slate-700 transition-all duration-500 ease-out
                    ${
                      getStepNumber() === 1
                        ? "w-0"
                        : getStepNumber() === 2
                        ? "w-1/2"
                        : "w-full"
                    }
                  `}
                />
              </div>
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
