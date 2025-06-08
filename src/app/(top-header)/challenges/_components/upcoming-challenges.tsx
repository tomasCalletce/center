import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/server";
import { Button, buttonVariants } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import {
  Clock,
  ArrowRight,
  Users,
  MapPin,
  Trophy,
  Calendar,
  Bell,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const UpcomingChallenges = async () => {
  const upcomingChallenges = await api.public.challenge.all({});

  if (true) {
    return (
      <div className="relative overflow-hidden p-12">
        <div className="relative mx-auto max-w-md text-center space-y-8">
          <div className="mx-auto w-fit">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-muted bg-muted/50">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold tracking-tight">
              No Active Challenges
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              We're preparing exciting new challenges for you. Check back soon.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button className="w-full cursor-pointer">
              <Bell className="mr-2 h-4 w-4" />
              Get Notified
              <span className="ml-2 text-xs text-primary bg-white px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
            </Button>
            <p className="text-sm text-muted-foreground">
              Be the first to know about new challenges
            </p>
          </div>
        </div>
      </div>
    );
  }

  const allChallenges = upcomingChallenges.map((challenge) => {
    const timeLeft = challenge.deadline_at
      ? formatDistanceToNow(new Date(challenge.deadline_at), {
          addSuffix: true,
        })
      : "No deadline";

    const formattedDate = challenge.deadline_at
      ? format(new Date(challenge.deadline_at), "MMM dd, yyyy")
      : "TBD";

    const pricePool = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: challenge.price_pool_currency,
      maximumFractionDigits: 0,
    }).format(challenge.price_pool);

    return (
      <div className="grid grid-cols-4 overflow-hidden rounded-2xl border bg-card shadow-xl h-[500px]">
        <Link
          href={`/challenges/${challenge.id}`}
          className="col-span-3 relative"
        >
          <Image
            src={challenge.image.url}
            alt={challenge.image.alt}
            fill
            className="object-cover"
            priority
          />
        </Link>

        {/* Details Section - 1/4 */}
        <div className="col-span-1 flex flex-col">
          {/* Top Details */}
          <div className="flex-1 p-6 space-y-6">
            {/* Prize Pool */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Prize Pool
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-foreground">
                  {pricePool}
                </div>
                <Badge variant="outline" className="text-xs">
                  {challenge.price_pool_currency}
                </Badge>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Deadline
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">
                  {formattedDate}
                </div>
                <Badge className="text-xs font-medium">
                  <Clock className="h-3 w-3 mr-1" />
                  {timeLeft}
                </Badge>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Event Type
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  Virtual
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Open
                </Badge>
              </div>
            </div>
          </div>

          {/* Bottom Title Section */}
          <div className="border-t bg-muted/50 p-6">
            <h2 className="font-bold text-lg leading-tight mb-2">
              {challenge.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Join this challenge and compete with developers worldwide
            </p>

            <Link
              className={cn(buttonVariants({ variant: "default" }), "w-full")}
              href={`/challenges/${challenge.id}`}
            >
              <SignedOut>Sign in to join</SignedOut>
              <SignedIn>
                Join Challenge
                <ArrowRight className="ml-1 h-4 w-4" />
              </SignedIn>
            </Link>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="space-y-12">
      {/* Section Header - Left aligned with cool line */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
          <h2 className="text-3xl font-bold tracking-tight">Open Challenges</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Choose from our curated selection of challenges and start building
          your next breakthrough project.
        </p>
      </div>

      {/* Challenges List */}
      <div className="space-y-8">{allChallenges}</div>
    </div>
  );
};
