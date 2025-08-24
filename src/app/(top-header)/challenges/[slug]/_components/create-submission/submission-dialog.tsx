"use client";

import { useState, useEffect } from "react";
import { /* Users, */ FileText, Clipboard, Rocket } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import { SubmissionMarkdownStep } from "~/app/(top-header)/challenges/[slug]/_components/create-submission/submission-markdown-step";
import { SubmissionResultStep } from "~/app/(top-header)/challenges/[slug]/_components/create-submission/submission-result-step";
import { SubmissionDetailsStep } from "~/app/(top-header)/challenges/[slug]/_components/create-submission/submission-details-step";
// import {
//   SubmissionTeamStep,
//   type TeamData,
// } from "~/app/(top-header)/challenges/[slug]/_components/create-submission/submission-team-step";
import { formSubmissionSchema } from "~/server/db/schemas/submissions";
import { submissionVisibilityValues } from "~/server/db/schemas/submissions";
import { z } from "zod";

export enum SUBMISSION_STEPS {
  // TEAM = "team",
  DETAILS = "details",
  MARKDOWN = "markdown",
  SUCCESS = "success",
  ERROR = "error",
}

type SubmissionDetailsSchema = z.infer<typeof formSubmissionSchema>;

export type DetailsData = {
  title: SubmissionDetailsSchema["title"];
  demo_url: SubmissionDetailsSchema["demo_url"];
  video_demo_url: SubmissionDetailsSchema["video_demo_url"];
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
  existingSubmission?: {
    id: string;
    title: string;
    markdown?: string | null;
    demo_url: string;
    video_demo_url: string;
    repository_url: string;
    status: string;
    _team: string;
    logo_image?: {
      id: string | null;
      alt: string | null;
      url: string | null;
      pathname: string | null;
    } | null;
  } | null;
}

export function SubmissionDialog({
  _challenge,
  children,
  existingSubmission = null,
}: SubmissionDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(SUBMISSION_STEPS.DETAILS);
  // const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [detailsData, setDetailsData] = useState<DetailsData | null>(null);
  const { user } = useUser();

  // Handle existing submission data when it becomes available
  useEffect(() => {
    if (existingSubmission) {
      setStep(SUBMISSION_STEPS.DETAILS);
      setDetailsData({
        title: existingSubmission.title,
        demo_url: existingSubmission.demo_url,
        video_demo_url: existingSubmission.video_demo_url,
        repository_url: existingSubmission.repository_url,
        image: existingSubmission.logo_image ? {
          alt: existingSubmission.logo_image.alt || '',
          url: existingSubmission.logo_image.url || '',
          pathname: existingSubmission.logo_image.pathname || '',
        } : {
          alt: '',
          url: '',
          pathname: '',
        }
      });
    } else {
      setStep(SUBMISSION_STEPS.DETAILS); // Skip team step for now
      setDetailsData(null);
    }
  }, [existingSubmission]);

  const utils = api.useUtils();

  const userTeamsQuery = api.team.getUserTeams.useQuery(
    { _challenge },
    { enabled: !existingSubmission }
  );

  const createTeamMutation = api.team.createTeam.useMutation({
    onSuccess: () => {
      userTeamsQuery.refetch();
    },
  });

  const createMutation = api.submission.create.useMutation({
    onSuccess: () => {
      // Close the modal immediately after successful creation
      setOpen(false);
      // Reset step for next time the modal is opened
      setStep(SUBMISSION_STEPS.DETAILS);
      // Invalidate relevant queries to refresh the UI
      utils.submission.getUserSubmission.invalidate({ challengeId: _challenge });
      utils.public.challenge.allSubmissions.invalidate();
      utils.public.challenge.stats.invalidate();
    },
    onError: () => {
      setStep(SUBMISSION_STEPS.ERROR);
    },
  });

  const updateMutation = api.submission.update.useMutation({
    onSuccess: () => {
      // Close the modal immediately after successful update
      setOpen(false);
      // Reset step for next time the modal is opened
      setStep(SUBMISSION_STEPS.DETAILS);
      // Invalidate relevant queries to refresh the UI
      utils.submission.getUserSubmission.invalidate({ challengeId: _challenge });
      utils.public.challenge.allSubmissions.invalidate();
      utils.public.challenge.stats.invalidate();
    },
    onError: () => {
      setStep(SUBMISSION_STEPS.ERROR);
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    
    // Reset state when modal is closed
    if (!newOpen) {
      if (existingSubmission) {
        setStep(SUBMISSION_STEPS.DETAILS);
      } else {
        setStep(SUBMISSION_STEPS.DETAILS); // Skip team step for now
        // setTeamData(null);
        setDetailsData(null);
      }
    }
  };

  // const handleTeamSubmit = (data: TeamData) => {
  //   setTeamData(data);
  //   setStep(SUBMISSION_STEPS.DETAILS);
  // };

  const handleDetailsSubmit = (data: DetailsData) => {
    setDetailsData({
      title: data.title,
      demo_url: data.demo_url,
      video_demo_url: data.video_demo_url,
      repository_url: data.repository_url,
      image: data.image,
    });
    setStep(SUBMISSION_STEPS.MARKDOWN);
  };

  const handleMarkdownSubmit = async (data: MarkdownData) => {
    if (!detailsData) return;

    if (existingSubmission) {
      updateMutation.mutate({
        id: existingSubmission.id,
        _challenge: _challenge,
        _team: existingSubmission._team,
        title: detailsData.title,
        demo_url: detailsData.demo_url,
        video_demo_url: detailsData.video_demo_url,
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
    } else {
      // Get or create a team automatically for new submissions
      let teamId: string;
      
      const existingTeams = userTeamsQuery.data || [];
      const availableTeam = existingTeams.find(team => !team.hasSubmission);
      
      if (availableTeam) {
        teamId = availableTeam.id;
      } else {
        // Create a personal team for this submission
        try {
          const newTeam = await createTeamMutation.mutateAsync({
            name: `${user?.firstName || 'Personal'} Team`,
            challengeId: _challenge,
          });
          teamId = newTeam.id;
        } catch (error) {
          console.error('Failed to create team:', error);
          setStep(SUBMISSION_STEPS.ERROR);
          return;
        }
      }
      
      createMutation.mutate({
        _challenge: _challenge,
        _team: teamId,
        title: detailsData.title,
        demo_url: detailsData.demo_url,
        video_demo_url: detailsData.video_demo_url,
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
    }
  };

  const handleBack = () => {
    if (step === SUBMISSION_STEPS.MARKDOWN) {
      setStep(SUBMISSION_STEPS.DETAILS);
    }
    // else if (step === SUBMISSION_STEPS.DETAILS) {
    //   setStep(SUBMISSION_STEPS.TEAM);
    // }
  };

  const getStepNumber = () => {
    switch (step) {
      // case SUBMISSION_STEPS.TEAM:
      //   return 1;
      case SUBMISSION_STEPS.DETAILS:
        return 1; // Now the first step
      case SUBMISSION_STEPS.MARKDOWN:
        return 2; // Now the second step
      case SUBMISSION_STEPS.SUCCESS:
      case SUBMISSION_STEPS.ERROR:
        return 3; // Now the third step
      default:
        return 1;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="!max-w-[1100px] min-h-[700px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{existingSubmission ? 'Edit Your Submission' : 'Submit Your Build'}</DialogTitle>
          <DialogDescription>
            {existingSubmission ? 'Update your project submission for this challenge.' : 'Submit your project for this challenge.'}
          </DialogDescription>
          <div className="relative">
            <div className="flex items-center justify-between max-w-xs mx-auto">
              {[
                // { num: 1, label: "Team", icon: <Users className="w-5 h-5" /> },
                {
                  num: 1,
                  label: "Details",
                  icon: <FileText className="w-5 h-5" />,
                },
                {
                  num: 2,
                  label: "Description",
                  icon: <Clipboard className="w-5 h-5" />,
                },
                {
                  num: 3,
                  label: "Submit",
                  icon: <Rocket className="w-5 h-5" />,
                },
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
                          ? "w-1/2"
                          : "w-full"
                    }
                  `}
                />
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          {/* Show loading state when editing and data isn't loaded yet */}
          {existingSubmission && !detailsData && (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
                <p className="mt-2 text-sm text-slate-600">Loading submission data...</p>
              </div>
            </div>
          )}
          
          {/* Team step commented out for now */}
          {/* {step === SUBMISSION_STEPS.TEAM && !existingSubmission && (
            <SubmissionTeamStep
              challengeId={_challenge}
              onNext={handleTeamSubmit}
            />
          )} */}
          {step === SUBMISSION_STEPS.DETAILS && (existingSubmission ? detailsData : true) && (
            <SubmissionDetailsStep
              handleOnSubmit={handleDetailsSubmit}
              onBack={undefined} // No back button since team step is disabled
              initialData={existingSubmission ? detailsData ?? undefined : undefined}
            />
          )}
          {step === SUBMISSION_STEPS.MARKDOWN && (
            <SubmissionMarkdownStep
              handleOnSubmit={handleMarkdownSubmit}
              onBack={handleBack}
              isLoading={createMutation.isPending || updateMutation.isPending || createTeamMutation.isPending}
              initialData={existingSubmission?.markdown ? { markdown: existingSubmission.markdown } : undefined}
            />
          )}
          {(step === SUBMISSION_STEPS.SUCCESS ||
            step === SUBMISSION_STEPS.ERROR) && (
            <SubmissionResultStep type={step} isEdit={!!existingSubmission} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
