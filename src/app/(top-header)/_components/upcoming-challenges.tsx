import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import {
  Clock,
  ArrowRight,
  Users,
  MapPin,
  Trophy,
  Calendar,
  CalendarDays,
  Play,
  X,
} from "lucide-react";

export const UpcomingChallenges = async () => {
  const upcomingChallenges = await api.public.challenge.all({});

  if (upcomingChallenges.length === 0) {
    return (
      <div className="container mx-auto">
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
    <section className="container mx-auto pt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingChallenges.map((challenge) => {
          const now = new Date();
          const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          
          // Convert UTC dates to user's local timezone
          const localOpenDate = toZonedTime(challenge.open_at, userTimeZone);
          const localDeadlineDate = toZonedTime(challenge.deadline_at, userTimeZone);
          
          const isSubmissionOpen =
            challenge.open_at && now >= challenge.open_at;
          const hasDeadlinePassed =
            challenge.deadline_at && now >= challenge.deadline_at;

          const submissionOpenTime = formatDistanceToNow(localOpenDate, {
            addSuffix: true,
          });

          const submissionCloseTime = formatDistanceToNow(
            localDeadlineDate,
            { addSuffix: true }
          );

          const formattedOpenDate = format(
            localOpenDate,
            "MMM dd, yyyy 'at' HH:mm"
          );

          const formattedDeadlineDate = format(
            localDeadlineDate,
            "MMM dd, yyyy 'at' HH:mm"
          );

          const pricePool = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: challenge.price_pool_currency,
            maximumFractionDigits: 0,
          }).format(challenge.price_pool);

          return (
            <Link
              key={challenge.id}
              href={`/challenges/${challenge.slug}`}
              className="block h-full"
            >
              <div className="h-full flex flex-col p-4 border border-dashed rounded-xl hover:border-slate-300 bg-white">
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 flex-shrink-0">
                  <Image
                    src={challenge.image.url}
                    alt={challenge.image.alt}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col flex-1 space-y-4">
                  <div className="space-y-2 flex-shrink-0">
                    <h3 className="text-xl font-medium leading-tight line-clamp-2">
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 flex-shrink-0">
                    <div className="inline-flex items-center gap-1 px-3 py-1 border border-dashed rounded-full text-sm font-medium">
                      <Trophy className="h-3 w-3" />
                      {pricePool}
                    </div>
                    {isSubmissionOpen && !hasDeadlinePassed && (
                      <Badge className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-colors font-medium">
                        <Play className="h-3 w-3 mr-1" />
                        Submissions Open
                      </Badge>
                    )}
                    {!isSubmissionOpen && (
                      <Badge className="text-xs px-3 py-1.5 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 transition-colors font-medium">
                        <Clock className="h-3 w-3 mr-1" />
                        Opens {submissionOpenTime}
                      </Badge>
                    )}
                    {hasDeadlinePassed && (
                      <Badge className="text-xs px-3 py-1.5 bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 transition-colors font-medium">
                        <X className="h-3 w-3 mr-1" />
                        Closed
                      </Badge>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-h-0">
                    <div className="flex gap-3 text-sm">
                      <div className="flex-1 p-3 border border-dashed rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Opens
                          </span>
                        </div>
                        <div className="text-sm font-medium text-foreground mb-1">
                          {formattedOpenDate}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {submissionOpenTime}
                        </div>
                      </div>

                      <div className="flex-1 p-3 border border-dashed rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Closes
                          </span>
                        </div>
                        <div className="text-sm font-medium text-foreground mb-1">
                          {formattedDeadlineDate}
                        </div>
                        {!hasDeadlinePassed && (
                          <div className="text-xs text-muted-foreground">
                            {submissionCloseTime}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-3 mt-4 flex-shrink-0">
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

                  <div className="pt-3 flex-shrink-0">
                    <Button className="w-full cursor-pointer">
                      View Challenge
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
