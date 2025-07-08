"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { SubmissionTeamSelectStep } from "./submission-team-select-step";
import { SubmissionTeamCreateStep } from "./submission-team-create-step";

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
