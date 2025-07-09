"use client";

import { useState } from "react";
import type { TeamData } from "./submission-team-step";
import { TeamChooseNameStep } from "./team-choose-name-step";
import { TeamChooseParticipantsStep } from "./team-choose-participants-step";

enum CREATE_STEP {
  CHOOSE_NAME = "choose_name",
  CHOOSE_PARTICIPANTS = "choose_participants",
}

interface SubmissionTeamCreateStepProps {
  challengeId: string;
  onNext: (data: TeamData) => void;
  onBack?: () => void;
}

export function SubmissionTeamCreateStep({
  challengeId,
  onNext,
  onBack,
}: SubmissionTeamCreateStepProps) {
  const [step, setStep] = useState(CREATE_STEP.CHOOSE_NAME);
  const [createdTeam, setCreatedTeam] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleTeamCreated = (teamData: { id: string; name: string }) => {
    setCreatedTeam(teamData);
    setStep(CREATE_STEP.CHOOSE_PARTICIPANTS);
  };

  const handleBackToName = () => {
    setStep(CREATE_STEP.CHOOSE_NAME);
    setCreatedTeam(null);
  };

  return (
    <>
      {step === CREATE_STEP.CHOOSE_NAME && (
        <TeamChooseNameStep
          challengeId={challengeId}
          onNext={handleTeamCreated}
          onBack={onBack}
        />
      )}
      {step === CREATE_STEP.CHOOSE_PARTICIPANTS && createdTeam && (
        <TeamChooseParticipantsStep
          teamData={createdTeam}
          onNext={onNext}
          onBack={handleBackToName}
        />
      )}
    </>
  );
}
