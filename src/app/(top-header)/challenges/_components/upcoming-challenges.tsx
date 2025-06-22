import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
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

export const UpcomingChallenges = async () => {
  const upcomingChallenges = await api.public.challenge.all({});

  if (upcomingChallenges.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-8">
          <div className="w-20 h-20 mx-auto border border-dashed rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-medium tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 text-transparent bg-clip-text">
              No Active Challenges
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              We're preparing exciting new challenges for you. Check back soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-1 w-8 bg-slate-900 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight">
              Open Challenges
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Sign up for a challenge and start building cool stuff.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingChallenges.map((challenge) => {
            const timeLeft = challenge.deadline_at
              ? formatDistanceToNow(challenge.deadline_at, {
                  addSuffix: true,
                })
              : "No deadline";

            const formattedDate = challenge.deadline_at
              ? format(challenge.deadline_at, "MMM dd, yyyy")
              : "TBD";

            const pricePool = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: challenge.price_pool_currency,
              maximumFractionDigits: 0,
            }).format(challenge.price_pool);

            return (
              <Link
                key={challenge.id}
                href={`/challenges/${challenge.slug}`}
                className="block space-y-4 p-4 border border-dashed rounded-xl"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src={challenge.image.url}
                    alt={challenge.image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-medium leading-tight">
                    {challenge.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1 px-3 py-1 border border-dashed rounded-full text-sm">
                      <Trophy className="h-3 w-3" />
                      {pricePool}
                    </div>
                    <div className="inline-flex items-center gap-1 px-3 py-1 border border-dashed rounded-full text-sm text-red-600">
                      <Clock className="h-3 w-3" />
                      {timeLeft}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Deadline: {formattedDate}
                    </p>
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
                  </div>
                  <div className="pt-2">
                    <Button className="w-full cursor-pointer">
                      View Challenge
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
