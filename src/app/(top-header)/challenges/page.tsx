import { HydrateClient } from "~/trpc/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Navigation } from "~/components/ui/navigation";
import { UpcomingChallenges } from "~/app/(top-header)/challenges/_components/upcoming-challenges";
import { Zap } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();

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
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-muted-foreground  leading-relaxed">
                Ready to showcase your skills? Check out the latest challenges
                and opportunities below.
              </p>
            </div>
          </div>
        </div>
        <UpcomingChallenges />
      </div>
    </HydrateClient>
  );
}
