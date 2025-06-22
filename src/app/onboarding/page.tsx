import { MainOnboardingForm } from "~/app/onboarding/_components/main-from";
import { HydrateClient } from "~/trpc/server";
import { StepIndicator } from "~/app/onboarding/_components/step-indicator";
import { CancelOnboardingButton } from "~/app/onboarding/_components/cancel-button";

export default function OnboardingComponent() {
  return (
    <HydrateClient>
      <div className="flex min-h-screen flex-col">
        <header className="relative border-b border-dashed border-primary/20 bg-background px-8 py-4">
          <div className="flex items-center gap-4">
            <CancelOnboardingButton />
            <div className="h-6 w-px bg-primary/30"></div>
            <h1 className="text-xl  font-medium tracking-wide text-primary/80">
              ACC Onboarding
            </h1>
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center px-4">
          <MainOnboardingForm />
        </main>
        <StepIndicator />
      </div>
    </HydrateClient>
  );
}
