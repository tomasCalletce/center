"use client";

import { useQueryState, parseAsStringEnum } from "nuqs";
import { NameDescriptionLogo } from "~/app/talent/challenges/[_challenge]/builds/submit/_components/name-description-logo";

export enum SubmissionStep {
  STEP_1 = "STEP_1",
  STEP_2 = "STEP_2",
  STEP_3 = "STEP_3",
}

export function MainSubmitBuildForm() {
  const [step, setStep] = useQueryState(
    "step",
    parseAsStringEnum(Object.values(SubmissionStep)).withDefault(
      SubmissionStep.STEP_1
    )
  );

  return <div>{step === SubmissionStep.STEP_1 && <NameDescriptionLogo />}</div>;
}
