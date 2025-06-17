import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/server";
import { Button, buttonVariants } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
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
import { titleToSlug } from "~/lib/utils";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const UpcomingChallenges = async () => {
  const upcomingChallenges = await api.public.challenge.all({});

  if (upcomingChallenges.length === 0) {
    return (
      <div className="relative overflow-hidden p-12">
        <div className="relative mx-auto max-w-md text-center space-y-8">
          <div className="mx-auto w-fit">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed bg-muted/50">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 text-transparent bg-clip-text">
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

  return (
    <div className="space-y-12">
      {/* Section Header */}
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

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingChallenges.map((challenge) => {
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

          const challengeSlug = titleToSlug(challenge.title);

          return (
            <Link key={challenge.id} href={`/challenges/${challengeSlug}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur cursor-pointer">
                {/* Challenge Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={challenge.image.url}
                    alt={challenge.image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Prize Pool Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-background/90 text-foreground border-0">
                      <Trophy className="h-3 w-3 mr-1" />
                      {pricePool}
                    </Badge>
                  </div>

                  {/* Deadline Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="destructive" className="bg-red-500/90 text-white border-0">
                      <Clock className="h-3 w-3 mr-1" />
                      {timeLeft}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-200">
                    {challenge.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Deadline: {formattedDate}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Virtual</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Open</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <div className={cn(buttonVariants({ variant: "default" }), "w-full group-hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center")}>
                    <SignedOut>Sign in to join</SignedOut>
                    <SignedIn>
                      View Challenge
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </SignedIn>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
