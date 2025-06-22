"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "~/components/ui/button";

interface SubmissionResultStepProps {
  success: boolean;
  onClose: () => void;
}

export function SubmissionResultStep({
  success,

  onClose,
}: SubmissionResultStepProps) {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="flex items-center justify-center">
        {success ? (
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
          {success ? "Submission Successful!" : "Submission Failed"}
        </h3>
      </div>

      <Button onClick={onClose} className="w-full">
        {success ? "Close" : "Try Again"}
      </Button>
    </div>
  );
}
