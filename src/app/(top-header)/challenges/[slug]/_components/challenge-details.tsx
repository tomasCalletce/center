import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/server";
import { buttonVariants } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { Clock, ArrowRight, Users, MapPin, Trophy } from "lucide-react";
import { cn } from "~/lib/utils";

interface ChallengeDetailsProps {
  slug: string;
}

export const ChallengeDetails: React.FC<ChallengeDetailsProps> = async ({
  slug,
}) => {
  const challenge = await api.public.challenge.details({
    challenge_slug: slug,
  });

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
    <div className="grid grid-cols-4 gap-4 overflow-hidden h-[500px]">
      <Link
        href={`/talent/challenges/${challenge.id}`}
        className="col-span-3 relative"
      >
        <Image
          src={challenge.image.url}
          alt={challenge.image.alt}
          fill
          className="object-cover rounded-xl"
          priority
        />
      </Link>

      {/* Details Section */}
      <div className="col-span-1 flex flex-col bg-card rounded-xl border">
        {/* Title Section - Moved to top */}
        <div className="p-6 border-b">
          <h2 className="font-semibold text-lg leading-tight mb-2">
            {challenge.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            Join this challenge and compete with developers worldwide
          </p>
        </div>

        {/* Details */}
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

        {/* Bottom CTA */}
        <div className="p-6 border-t">
          <Link
            className={cn(buttonVariants({ variant: "default" }), "w-full")}
            href={`/challenges/${challenge.id}/submissions/submit`}
          >
            Submit Build
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
