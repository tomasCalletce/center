import Image from "next/image";
import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Clock, Users, MapPin, Trophy, Calendar } from "lucide-react";
import { ChallengeSubmissionButton } from "./challenge-submission-button";
import { ChallengeStats } from "./challenge-stats";

interface ChallengeDetailsProps {
  slug: string;
}

export const ChallengeDetails: React.FC<ChallengeDetailsProps> = async ({
  slug,
}) => {
  const [challenge, stats] = await Promise.all([
    api.public.challenge.details({
      challenge_slug: slug,
    }),
    api.public.challenge.stats({
      challenge_slug: slug,
    }),
  ]);

  const colombiaTimeZone = "America/Bogota";
  const localDeadlineDate = toZonedTime(challenge.deadline_at, colombiaTimeZone);
  const localOpenDate = toZonedTime(challenge.open_at, colombiaTimeZone);
  const nowInColombia = toZonedTime(new Date(), colombiaTimeZone);
  
  const formattedDeadlineDate = format(localDeadlineDate, "MMM dd, yyyy 'at' HH:mm");
  const formattedOpenDate = format(localOpenDate, "MMM dd, yyyy 'at' HH:mm");
  const timeLeft = formatDistanceToNow(localDeadlineDate, {
    addSuffix: true,
  });
  const openTimeLeft = formatDistanceToNow(localOpenDate, {
    addSuffix: true,
  });
  const isSubmissionOpen = challenge.open_at ? nowInColombia >= localOpenDate : false;
  const isDeadlinePassed = nowInColombia > localDeadlineDate;
  const pricePool = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: challenge.price_pool_currency,
    maximumFractionDigits: 0,
  }).format(challenge.price_pool);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden">
      <div className="md:col-span-3 relative h-64 md:h-auto">
        <Image
          src={challenge.image.url}
          alt={challenge.image.alt}
          fill
          className="object-cover rounded-xl"
          priority
        />
        <div className="absolute bottom-4 left-4">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg">
            <ChallengeStats stats={stats} />
          </div>
        </div>
      </div>
      <div className="md:col-span-1 flex flex-col bg-card rounded-xl border">
        <div className="p-6 border-b">
          <h1 className="font-bold text-2xl leading-tight">
            {challenge.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {challenge.description}
          </p>
        </div>
        <div className="flex-1 p-6 space-y-6">
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
              Submissions Open
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">
                {formattedOpenDate}
              </div>
              <Badge
                variant={
                  isDeadlinePassed
                    ? "destructive"
                    : isSubmissionOpen
                      ? "default"
                      : "secondary"
                }
                className="text-xs font-medium"
              >
                <Calendar className="h-3 w-3 mr-1" />
                {isDeadlinePassed
                  ? "Closed"
                  : isSubmissionOpen
                    ? "Open now"
                    : openTimeLeft}
              </Badge>
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Submission Deadline
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">
                {formattedDeadlineDate}
              </div>
              <Badge
                variant={isDeadlinePassed ? "destructive" : "default"}
                className="text-xs font-medium"
              >
                <Clock className="h-3 w-3 mr-1" />
                {isDeadlinePassed ? "Ended" : timeLeft}
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
        <div className="p-6 border-t">
          <ChallengeSubmissionButton
            challengeId={challenge.id}
            isSubmissionOpen={isSubmissionOpen}
          />
        </div>
      </div>
    </div>
  );
};
