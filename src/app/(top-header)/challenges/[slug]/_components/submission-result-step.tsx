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
    <div className="text-center space-y-8 py-12">
      <div className="flex items-center justify-center">
        {type === SUBMISSION_STEPS.SUCCESS ? (
          <div className="relative">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl opacity-20 blur-lg"></div>
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl shadow-lg">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl opacity-20 blur-lg"></div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          {type === SUBMISSION_STEPS.SUCCESS
            ? "🎉 Submission Successful!"
            : "❌ Submission Failed"}
        </h3>
        <p className="text-slate-500 max-w-md mx-auto">
          {type === SUBMISSION_STEPS.SUCCESS
            ? "Your project has been submitted successfully! Our team will review it and get back to you soon."
            : "Something went wrong while submitting your project. Please try again or contact support if the issue persists."}
        </p>
      </div>

      {type === SUBMISSION_STEPS.SUCCESS && (
        <div className="bg-slate-50 rounded-xl p-6 border border-dashed border-slate-200 max-w-md mx-auto">
          <div className="space-y-3">
            <div className="flex items-center justify-center w-12 h-12 bg-slate-900 rounded-lg mx-auto">
              <span className="text-white text-lg">🚀</span>
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
