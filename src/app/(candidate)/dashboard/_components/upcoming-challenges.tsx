import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { formatDistanceToNow, format, isAfter } from "date-fns";
import {
  Clock,
  ArrowRight,
  Calendar,
  Users,
  MapPin,
  Trophy,
} from "lucide-react";

export const UpcomingChallenges = async () => {
  const upcomingChallenges = await api.challenge.all({});

  const allChallenges = upcomingChallenges.map((challenge) => {
    const isActive = challenge.deadline_at
      ? isAfter(new Date(challenge.deadline_at), new Date())
      : true;
    const timeLeft = challenge.deadline_at
      ? formatDistanceToNow(new Date(challenge.deadline_at), {
          addSuffix: true,
        })
      : "No deadline";
    const formattedDate = challenge.deadline_at
      ? format(new Date(challenge.deadline_at), "MMM dd, yyyy")
      : "TBD";

    return (
      <div className="grid grid-cols-4 overflow-hidden rounded-2xl border bg-card shadow-xl h-[500px]">
        <div className="col-span-3 relative">
          {challenge.asset?.url ? (
            <Image
              src={challenge.asset.url}
              alt={challenge.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <Calendar className="h-32 w-32 text-slate-600" />
            </div>
          )}
        </div>

        {/* Details Section - 1/4 */}
        <div className="col-span-1 flex flex-col">
          {/* Top Details */}
          <div className="flex-1 p-6 space-y-6">
            {/* Prize Pool */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Prize Pool
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-foreground">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: challenge.price_pool_currency,
                    maximumFractionDigits: 0,
                  }).format(challenge.price_pool)}
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
                <Badge
                  variant={isActive ? "outline" : "destructive"}
                  className="text-xs font-medium"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {timeLeft}
                </Badge>
              </div>
            </div>

            {/* Event Type */}
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

            <Button className="w-full" asChild>
              <Link href={`/challenges/${challenge.id}`}>
                Join Challenge
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  });

  return <div className="space-y-8">{allChallenges}</div>;
};
