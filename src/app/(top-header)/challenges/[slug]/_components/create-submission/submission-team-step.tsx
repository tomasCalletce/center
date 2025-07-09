"use client";

import { useState } from "react";
import { SubmissionTeamCreateStep } from "~/app/(top-header)/challenges/[slug]/_components/create-submission/submission-team-create-step";
import { SubmissionTeamSelectStep } from "~/app/(top-header)/challenges/[slug]/_components/submission-team-select-step";

export type TeamData = {
  teamId: string;
  teamName: string;
  memberCount: number;
};

interface SubmissionTeamStepProps {
  challengeId: string;
  onNext: (data: TeamData) => void;
  initialData?: TeamData;
}

export function SubmissionTeamStep({
  challengeId,
  onNext,
}: SubmissionTeamStepProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateNew = () => {
    setShowCreateForm(true);
  };

  const handleBackToSelect = () => {
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <SubmissionTeamCreateStep
        challengeId={challengeId}
        onNext={onNext}
        onBack={handleBackToSelect}
      />
    );
  }

  return (
    <SubmissionTeamSelectStep
      challengeId={challengeId}
      onNext={onNext}
      onCreateNew={handleCreateNew}
    />
  );
}
