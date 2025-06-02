import { HydrateClient } from "~/trpc/server";
import { AllSubmissions } from "~/app/(top-header)/submissions/_components/all-submissions";
import { Trophy } from "lucide-react";

export default async function Submissions() {
  return (
    <HydrateClient>
      <div className="w-full px-6 py-6 space-y-10">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm" />
              <div className="relative bg-gradient-to-br from-primary/10 to-primary/20 p-3 rounded-xl border border-primary/30 shadow-sm">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text">
                Your Submissions
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Track all your project submissions and see how your skills are
                showcased across different challenges.
              </p>
            </div>
          </div>
        </div>
        <AllSubmissions />
      </div>
    </HydrateClient>
  );
}
