import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import {
  Clock,
  Users,
  MapPin,
  Trophy,
  Calendar,
} from "lucide-react";
import { ChallengeSubmissionButton } from "./challenge-submission-button";

interface ChallengeDetailsProps {
  slug: string;
}

export const ChallengeDetails: React.FC<ChallengeDetailsProps> = async ({
  slug,
}) => {
  const challenge = await api.public.challenge.details({
    challenge_slug: slug,
  });

  const formattedDeadlineDate = format(challenge.deadline_at, "MMM dd, yyyy");
  const formattedOpenDate = format(challenge.open_at, "MMM dd, yyyy");

  const timeLeft = formatDistanceToNow(challenge.deadline_at, {
    addSuffix: true,
  });

  const openTimeLeft = formatDistanceToNow(new Date(challenge.open_at), {
    addSuffix: true,
  });

  const isSubmissionOpen = challenge.open_at
    ? new Date() >= challenge.open_at
    : false;

  const pricePool = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: challenge.price_pool_currency,
    maximumFractionDigits: 0,
  }).format(challenge.price_pool);

  return (
    <div className="grid grid-cols-4 gap-4 overflow-hidden">
      <div className="col-span-3 relative">
        <Image
          src={challenge.image.url}
          alt={challenge.image.alt}
          fill
          className="object-cover rounded-xl"
          priority
        />
      </div>
      <div className="col-span-1 flex flex-col bg-card rounded-xl border">
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
                variant={isSubmissionOpen ? "default" : "secondary"}
                className="text-xs font-medium"
              >
                <Calendar className="h-3 w-3 mr-1" />
                {isSubmissionOpen ? "Open now" : openTimeLeft}
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
