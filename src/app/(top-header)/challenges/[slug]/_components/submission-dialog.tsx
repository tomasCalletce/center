"use client";

import { useState, useEffect } from "react";
import { Users, FileText, Clipboard, Rocket } from "lucide-react";
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
import { SubmissionTeamStep, type TeamData } from "~/app/(top-header)/challenges/[slug]/_components/submission-team-step";
import { formSubmissionSchema } from "~/server/db/schemas/submissions";
import { submissionVisibilityValues } from "~/server/db/schemas/submissions";
import { z } from "zod";

export enum SUBMISSION_STEPS {
  TEAM = "team",
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
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(SUBMISSION_STEPS.TEAM);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [detailsData, setDetailsData] = useState<DetailsData | null>(null);

  const utils = api.useUtils();

  const userSubmissionQuery = api.submission.getUserSubmission.useQuery(
    { challengeId: _challenge },
    { enabled: open }
  );

  const userTeamsQuery = api.team.getUserTeams.useQuery(
    { challengeId: _challenge },
    { enabled: open }
  );

  const isEditMode = !!userSubmissionQuery.data;

  const createMutation = api.submission.create.useMutation({
    onSuccess: () => {
      setStep(SUBMISSION_STEPS.SUCCESS);
      utils.submission.getUserSubmission.invalidate({ challengeId: _challenge });
    },
    onError: () => {
      setStep(SUBMISSION_STEPS.ERROR);
    },
  });

  const updateMutation = api.submission.update.useMutation({
    onSuccess: () => {
      setStep(SUBMISSION_STEPS.SUCCESS);
      utils.submission.getUserSubmission.invalidate({ challengeId: _challenge });
    },
    onError: () => {
      setStep(SUBMISSION_STEPS.ERROR);
    },
  });

  const resetDialogState = () => {
    if (userTeamsQuery.data && userTeamsQuery.data.length > 0 && !isEditMode) {
      setStep(SUBMISSION_STEPS.DETAILS);
    } else {
      setStep(SUBMISSION_STEPS.TEAM);
      setTeamData(null);
    }
    setDetailsData(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetDialogState();
    }
  };

  useEffect(() => {
    if (isEditMode && userSubmissionQuery.data && !detailsData) {
      const submission = userSubmissionQuery.data;
      setDetailsData({
        title: submission.title,
        demo_url: submission.demo_url,
        repository_url: submission.repository_url,
        image: {
          alt: submission.logo_image?.alt || "",
          url: submission.logo_image?.url || "",
          pathname: submission.logo_image?.pathname || "",
        },
      });
    }
  }, [isEditMode, userSubmissionQuery.data, detailsData]);

  useEffect(() => {
    if (open && userTeamsQuery.data && userTeamsQuery.data.length > 0 && !teamData) {
      const existingTeam = userTeamsQuery.data[0];
      if (existingTeam) {
        setTeamData({
          teamId: existingTeam.id,
          teamName: existingTeam.name,
          memberCount: 1,
        });
        if (!isEditMode) {
          setStep(SUBMISSION_STEPS.DETAILS);
        }
      }
    }
  }, [open, userTeamsQuery.data, teamData, isEditMode]);

  const handleTeamSubmit = (data: TeamData) => {
    setTeamData(data);
    setStep(SUBMISSION_STEPS.DETAILS);
  };

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
    if (!detailsData || !teamData) return;

    const submissionData = {
      _challenge: _challenge,
      _team: teamData.teamId,
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
    };

    if (isEditMode && userSubmissionQuery.data) {
      updateMutation.mutate({
        ...submissionData,
        id: userSubmissionQuery.data.id,
      });
    } else {
      createMutation.mutate(submissionData);
    }
  };

  const handleBack = () => {
    if (step === SUBMISSION_STEPS.MARKDOWN) {
      setStep(SUBMISSION_STEPS.DETAILS);
    } else if (step === SUBMISSION_STEPS.DETAILS) {
      setStep(SUBMISSION_STEPS.TEAM);
    }
  };

  const getStepNumber = () => {
    switch (step) {
      case SUBMISSION_STEPS.TEAM:
        return 1;
      case SUBMISSION_STEPS.DETAILS:
        return 2;
      case SUBMISSION_STEPS.MARKDOWN:
        return 3;
      case SUBMISSION_STEPS.SUCCESS:
      case SUBMISSION_STEPS.ERROR:
        return 4;
      default:
        return 1;
    }
  };

  const initialMarkdownData = isEditMode && userSubmissionQuery.data 
    ? { markdown: userSubmissionQuery.data.markdown || "" }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="!max-w-[1100px] min-h-[700px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Your Submission" : "Submit Your Build"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Update your project submission for this challenge."
              : "Submit your project for this challenge."
            }
          </DialogDescription>
          <div className="relative">
            <div className="flex items-center justify-between max-w-xs mx-auto">
              {[
                { num: 1, label: "Team", icon: <Users className="w-5 h-5" /> },
                { num: 2, label: "Details", icon: <FileText className="w-5 h-5" /> },
                { num: 3, label: "Description", icon: <Clipboard className="w-5 h-5" /> },
                { num: 4, label: isEditMode ? "Update" : "Submit", icon: <Rocket className="w-5 h-5" /> },
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
                    <div className="flex items-center justify-center text-lg leading-none">
                      {step.num < getStepNumber()
                        ? "✓"
                        : step.num === getStepNumber()
                        ? step.icon
                        : step.num}
                    </div>
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

              <div className="absolute top-6 left-6 right-6 h-0.5 bg-gradient-to-r from-slate-200 via-slate-200 to-slate-200 -z-0">
                <div
                  className={`
                    h-full bg-gradient-to-r from-slate-900 to-slate-700 transition-all duration-500 ease-out
                    ${
                      getStepNumber() === 1
                        ? "w-0"
                        : getStepNumber() === 2
                        ? "w-1/3"
                        : getStepNumber() === 3
                        ? "w-2/3"
                        : "w-full"
                    }
                  `}
                />
              </div>
            </div>
          </div>
        </DialogHeader>
        <div>
          {step === SUBMISSION_STEPS.TEAM && (
            <SubmissionTeamStep
              challengeId={_challenge}
              onNext={handleTeamSubmit}
              initialData={teamData ?? undefined}
            />
          )}
          {step === SUBMISSION_STEPS.DETAILS && (
            <SubmissionDetailsStep 
              handleOnSubmit={handleDetailsSubmit}
              initialData={detailsData}
              onBack={handleBack}
            />
          )}
          {step === SUBMISSION_STEPS.MARKDOWN && (
            <SubmissionMarkdownStep
              handleOnSubmit={handleMarkdownSubmit}
              onBack={handleBack}
              isLoading={createMutation.isPending || updateMutation.isPending}
              initialData={initialMarkdownData}
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
