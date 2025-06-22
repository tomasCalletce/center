"use client";

import { useClerk } from "@clerk/nextjs";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "~/components/ui/button";

export function CancelOnboardingButton() {
  const { signOut } = useClerk();

  const handleCancel = async () => {
    await signOut({ redirectUrl: "/" });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCancel}
      className="group flex cursor-pointer items-center gap-2 text-primary/70 hover:text-primary hover:bg-primary/5 transition-colors"
    >
      <ArrowLeft className="h-4 w-4 " />
      <span className="text-sm font-medium">Cancel</span>
    </Button>
  );
}
