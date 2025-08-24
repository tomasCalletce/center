"use client";

import Link from "next/link";
import { Button, buttonVariants } from "~/components/ui/button";
import { ArrowRight, Bell, Check, Edit, Monitor } from "lucide-react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { SubmissionDialog } from "./create-submission/submission-dialog";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useIsMobile } from "~/hooks/use-mobile";
 

interface ChallengeSubmissionButtonProps {
  challengeId: string;
  isSubmissionOpen: boolean;
  isDeadlinePassed: boolean;
}

export const ChallengeSubmissionButton: React.FC<
  ChallengeSubmissionButtonProps
> = ({ challengeId, isSubmissionOpen, isDeadlinePassed }) => {
  const { isSignedIn, isLoaded } = useUser();
  const isMobile = useIsMobile();

  const challengeDetailsQuery = api.public.challenge.details.useQuery({
    _challenge: challengeId,
  });

  const userSubmissionQuery = api.submission.getUserSubmission.useQuery(
    { challengeId },
    { enabled: isSignedIn && isSubmissionOpen }
  );

  const notifyMutation = api.public.challenge.notifyInterest.useMutation({
    onSuccess: () => {
      toast.success("You'll be notified when submissions open!");
      challengeDetailsQuery.refetch();
    },
    onError: () => {
      toast.error("Failed to save notification preference");
    },
  });

  const handleNotifyClick = () => {
    notifyMutation.mutate({ challengeId });
  };

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <SignInButton>
        <Button
          variant="default"
          className="w-full cursor-pointer"
        >
          Sign in to submit
        </Button>
      </SignInButton>
    );
  }

  if (!isSubmissionOpen) {
    return (
      <Button
        className="w-full cursor-pointer"
        variant="secondary"
        onClick={handleNotifyClick}
        isLoading={notifyMutation.isPending}
        disabled={
          notifyMutation.isPending || challengeDetailsQuery.data?.is_notified
        }
      >
        {challengeDetailsQuery.data?.is_notified ? (
          <>
            Notifications enabled
            <Check className="ml-1 h-4 w-4" />
          </>
        ) : (
          <>
            Notify me
            <Bell className="ml-1 h-4 w-4" />
          </>
        )}
      </Button>
    );
  }

  const hasSubmitted = userSubmissionQuery.data;

  if (isDeadlinePassed) {
    return (
      <Button className="w-full cursor-pointer" variant="outline" disabled>
        Submission Closed
        <Check className="ml-2 h-4 w-4" />
      </Button>
    );
  }

  if (hasSubmitted) {
    return (
      <SubmissionDialog _challenge={challengeId} existingSubmission={hasSubmitted}>
        <Button className="w-full cursor-pointer" variant="secondary">
          <Edit className="mr-2 h-4 w-4" />
          Edit submission
        </Button>
      </SubmissionDialog>
    );
  }

  if (isMobile) {
    return (
      <Button className="w-full cursor-pointer" variant="secondary" disabled>
        <Monitor className="mr-2 h-4 w-4" />
        Open on desktop to submit
      </Button>
    );
  }

  return (
    <SubmissionDialog _challenge={challengeId}>
      <Button className="w-full cursor-pointer">
        Submit Build
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </SubmissionDialog>
  );
};
