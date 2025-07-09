"use client";

import { useState } from "react";
import { SubmissionTeamCreateStep } from "~/app/(top-header)/challenges/[slug]/_components/create-submission/submission-team-create-step";
import { SubmissionTeamSelectStep } from "~/app/(top-header)/challenges/[slug]/_components/create-submission/submission-team-select-step";

export type TeamData = {
  teamId: string;
  teamName: string;
  memberCount: number;
};

enum TEAM_STEP {
  SELECT = "select",
  CREATE = "create",
}

interface SubmissionTeamStepProps {
  challengeId: string;
  onNext: (data: TeamData) => void;
  initialData?: TeamData;
}

export function SubmissionTeamStep({
  challengeId,
  onNext,
}: SubmissionTeamStepProps) {
  const [step, setStep] = useState(TEAM_STEP.SELECT);

  const handleCreateNew = () => {
    setStep(TEAM_STEP.CREATE);
  };

  const handleBackToSelect = () => {
    setStep(TEAM_STEP.SELECT);
  };

  return (
    <>
      {step === TEAM_STEP.SELECT && (
        <SubmissionTeamSelectStep
          challengeId={challengeId}
          onNext={onNext}
          onCreateNew={handleCreateNew}
        />
      )}
      {step === TEAM_STEP.CREATE && (
        <SubmissionTeamCreateStep
          challengeId={challengeId}
          onNext={onNext}
          onBack={handleBackToSelect}
        />
      )}
    </>
  );
}
