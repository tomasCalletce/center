import { HydrateClient } from "~/trpc/server";
import { Zap } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";

export default async function Submissions() {
  return (
    <HydrateClient>
      <div className="w-full px-6 py-6 space-y-10">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm" />
              <div className="relative bg-gradient-to-br from-primary/10 to-primary/20 p-3 rounded-xl border border-primary/30 shadow-sm">
                <Zap className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text">
                Your Submission
              </h1>
              <p className="text-muted-foreground  leading-relaxed">
                Review your submission details, status, and feedback below.
              </p>
            </div>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
