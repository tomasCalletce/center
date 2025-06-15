"use client";

import { useUser } from "@clerk/nextjs";
import { Badge } from "~/components/ui/badge";

export const StepIndicator = () => {
  const { user, isLoaded } = useUser();

  const currentStep =
    !isLoaded || !user?.publicMetadata?.onboardingStatus ? 0 : 1;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10">
      <div className="flex items-center space-x-4 rounded-xl bg-card px-6 py-3 border border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Badge variant={currentStep === 0 ? "default" : "secondary"}>
              1
            </Badge>
            <span
              className={`ml-2 text-sm ${
                currentStep === 0
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Upload CV
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
