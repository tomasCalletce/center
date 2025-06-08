import { HydrateClient } from "~/trpc/server";
import { UpcomingChallenges } from "~/app/(top-header)/challenges/_components/upcoming-challenges";
import { Zap } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Badge } from "~/components/ui/badge";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="container mx-auto px-4 py-16 ">
        <div className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          <div className="relative px-8 py-20">
            <div className="mx-auto max-w-4xl text-center space-y-12">
              <div className="mx-auto w-fit group">
                <div className="from-primary/20 via-primary/10 border-primary/20 relative flex h-20 w-20 items-center justify-center rounded-2xl border bg-gradient-to-br to-transparent shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <div className="from-primary to-primary/80 rounded-xl bg-gradient-to-br p-4 shadow-inner">
                    <Zap className="text-primary-foreground h-7 w-7" />
                  </div>
                </div>
              </div>

              <SignedIn>
                <div className="space-y-6">
                  <h1 className="text-5xl font-bold tracking-tight lg:text-7xl">
                    Welcome back
                  </h1>
                  <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
                    Your next breakthrough is just one challenge away. Ready to
                    build something amazing?
                  </p>
                </div>
              </SignedIn>

              <SignedOut>
                <div className="space-y-6">
                  <h1 className="text-5xl font-bold tracking-tight lg:text-7xl">
                    Build. Compete. Connect.
                  </h1>
                  <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
                    Join talented developers solving real problems for
                    world-class startups. Your next opportunity starts here.
                  </p>
                </div>
              </SignedOut>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Badge
                  variant="secondary"
                  className="gap-2 px-4 py-2 text-sm font-medium"
                >
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  3 Live Challenges
                </Badge>
                <Badge
                  variant="outline"
                  className="gap-2 px-4 py-2 text-sm font-medium"
                >
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  50+ Partner Startups
                </Badge>
                <Badge
                  variant="secondary"
                  className="gap-2 px-4 py-2 text-sm font-medium"
                >
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  $50K+ in Prizes
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <UpcomingChallenges />
      </div>
    </HydrateClient>
  );
}
