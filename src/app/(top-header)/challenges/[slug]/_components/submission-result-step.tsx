"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SUBMISSION_STEPS } from "./submission-dialog";

interface SubmissionResultStepProps {
  type: SUBMISSION_STEPS.SUCCESS | SUBMISSION_STEPS.ERROR;
}

export const SubmissionResultStep: React.FC<SubmissionResultStepProps> = ({
  type,
}) => {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="flex items-center justify-center">
        {type === SUBMISSION_STEPS.SUCCESS ? (
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          {type === SUBMISSION_STEPS.SUCCESS
            ? "Submission Successful!"
            : "Submission Failed"}
        </h3>
      </div>
    </div>
  );
};
