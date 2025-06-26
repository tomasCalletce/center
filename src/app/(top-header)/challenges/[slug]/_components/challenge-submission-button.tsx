"use client";

import Link from "next/link";
import { Button, buttonVariants } from "~/components/ui/button";
import { ArrowRight, Bell, Check } from "lucide-react";
import { cn } from "~/lib/utils";
import { useUser } from "@clerk/nextjs";
import { SubmissionDialog } from "./submission-dialog";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useState } from "react";

interface ChallengeSubmissionButtonProps {
  challengeId: string;
  isSubmissionOpen: boolean;
}

export function ChallengeSubmissionButton({
  challengeId,
  isSubmissionOpen,
}: ChallengeSubmissionButtonProps) {
  const { isSignedIn, isLoaded } = useUser();
  const [isNotified, setIsNotified] = useState(false);

  const notifyMutation = api.public.challenge.notifyInterest.useMutation({
    onSuccess: () => {
      setIsNotified(true);
      toast.success("You'll be notified when submissions open!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save notification preference");
    },
  });

  const handleNotifyClick = () => {
    notifyMutation.mutate({ challengeId });
  };

  if (!isLoaded) {
    return (
      <Button className="w-full" disabled>
        Loading...
      </Button>
    );
  }

  if (!isSignedIn) {
    return (
      <Link
        className={cn(buttonVariants({ variant: "default" }), "w-full")}
        href="/sign-in"
      >
        Sign in to submit
      </Link>
    );
  }

  if (!isSubmissionOpen) {
    return (
      <Button 
        className="w-full" 
        variant="secondary"
        onClick={handleNotifyClick}
        disabled={notifyMutation.isPending || isNotified}
      >
        {isNotified ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Notifications enabled
          </>
        ) : (
          <>
            <Bell className="mr-2 h-4 w-4" />
            {notifyMutation.isPending ? "Saving..." : "Notify me"}
          </>
        )}
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
} 