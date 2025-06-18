import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/server";
import { buttonVariants } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import {
  Clock,
  ArrowRight,
  Users,
  MapPin,
  Trophy,
  Calendar,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { MDXRenderer } from "~/components/mdx-renderer";

interface ChallengeDetailsProps {
  slug: string;
}

export const ChallengeDetails: React.FC<ChallengeDetailsProps> = async ({
  slug,
}) => {
  const challengeData = await api.public.challenge.detailsBySlug({
    challenge_slug: slug,
  });

  const timeLeft = challengeData.deadline_at
    ? formatDistanceToNow(new Date(challengeData.deadline_at), {
        addSuffix: true,
      })
    : "No deadline";

  const formattedDate = challengeData.deadline_at
    ? format(new Date(challengeData.deadline_at), "MMM dd, yyyy")
    : "TBD";

  const pricePool = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: challengeData.price_pool_currency,
    maximumFractionDigits: 0,
  }).format(challengeData.price_pool);

  return (
    <div className="space-y-8">
      <div className="relative h-96 rounded-2xl overflow-hidden">
        <Image
          src={challengeData.image.url}
          alt={challengeData.image.alt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge className="bg-background/90 text-foreground border-0">
              <Trophy className="h-3 w-3 mr-1" />
              {pricePool} Prize Pool
            </Badge>
            <Badge
              variant="destructive"
              className="bg-red-500/90 text-white border-0"
            >
              <Clock className="h-3 w-3 mr-1" />
              {timeLeft}
            </Badge>
            <Badge
              variant="outline"
              className="bg-background/90 text-foreground border-0"
            >
              <MapPin className="h-3 w-3 mr-1" />
              Virtual
            </Badge>
            <Badge
              variant="outline"
              className="bg-background/90 text-foreground border-0"
            >
              <Users className="h-3 w-3 mr-1" />
              Open
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {challengeData.title}
          </h1>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Deadline: {formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-card rounded-xl border p-8">
            <h2 className="text-2xl font-semibold mb-6 text-foreground"></h2>
            {challengeData.markdown ? (
              await (<MDXRenderer content={challengeData.markdown} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Challenge details will be available soon.</p>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Challenge Info
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Prize Pool
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {pricePool}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Deadline
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground">
                    {formattedDate}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {timeLeft}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Event Type
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className="justify-start text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    Virtual
                  </Badge>
                  <Badge variant="outline" className="justify-start text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    Open to All
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <Link
                className={cn(buttonVariants({ variant: "default" }), "w-full")}
                href={`/challenges/${challengeData.id}/submissions/submit`}
              >
                Submit Build
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
