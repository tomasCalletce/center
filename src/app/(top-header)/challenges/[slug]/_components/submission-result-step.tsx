"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { SUBMISSION_STEPS } from "./submission-dialog";

interface SubmissionResultStepProps {
  type: SUBMISSION_STEPS.SUCCESS | SUBMISSION_STEPS.ERROR;
}

export const SubmissionResultStep: React.FC<SubmissionResultStepProps> = ({
  type,
}) => {
  return (
    <div className="text-center space-y-8 py-12">
      <div className="flex items-center justify-center">
        {type === SUBMISSION_STEPS.SUCCESS ? (
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-900/20 bg-gradient-to-br from-emerald-900/20 via-emerald-900/10 to-transparent shadow-lg transition-transform duration-300">
            <div className="rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-900/80 p-4 shadow-inner">
              <CheckCircle className="h-7 w-7 text-white" />
            </div>
          </div>
        ) : (
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-red-900/20 bg-gradient-to-br from-red-900/20 via-red-900/10 to-transparent shadow-lg transition-transform duration-300">
            <div className="rounded-xl bg-gradient-to-br from-red-800 to-red-900/80 p-4 shadow-inner">
              <XCircle className="h-7 w-7 text-white" />
            </div>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          {type === SUBMISSION_STEPS.SUCCESS
            ? "Submission Successful!"
            : "Submission Failed"}
        </h3>
        <p className="max-w-md mx-auto">
          {type === SUBMISSION_STEPS.SUCCESS ? (
            <span className="text-slate-600">
              Your project has been submitted successfully! Our team will review
              it and get back to you soon.
            </span>
          ) : (
            <span className="text-slate-600">
              Something went wrong while submitting your project. Please try
              again or contact support if the issue persists.
            </span>
          )}
        </p>
      </div>

      {type === SUBMISSION_STEPS.SUCCESS && (
        <div className="bg-slate-50 rounded-xl p-6 border border-dashed border-slate-200 max-w-md mx-auto">
          <div className="space-y-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-slate-900/20 bg-gradient-to-br from-slate-900/20 via-slate-900/10 to-transparent shadow mx-auto">
              <div className="rounded-md bg-gradient-to-br from-slate-900 to-slate-900/80 p-2 shadow-inner">
                <span className="text-white text-sm">🚀</span>
              </div>
            </div>
            <h4 className="font-semibold text-slate-900">What's Next?</h4>
            <p className="text-sm text-slate-600">
              We'll review your submission and notify you about the results.
              Keep building amazing things!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
