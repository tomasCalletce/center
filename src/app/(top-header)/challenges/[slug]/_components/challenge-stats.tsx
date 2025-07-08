"use client";

import { api } from "~/trpc/react";
import { Users, Trophy, Calendar } from "lucide-react";
import { useIsMobile } from "~/hooks/use-mobile";

interface ChallengeStatsProps {
  slug: string;
}

export const ChallengeStats: React.FC<ChallengeStatsProps> = ({ slug }) => {
  const isMobile = useIsMobile();

  const statsQuery = api.public.challenge.stats.useQuery({
    challenge_slug: slug,
  });

  if (isMobile) {
    return null;
  }

  if (!statsQuery.data) {
    return null;
  }

  return (
    <div className="flex gap-6 text-sm text-muted-foreground px-4 py-1">
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4" />
        <span className="font-medium">
          {statsQuery.data.total_submissions} submissions
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span className="font-medium">
          {statsQuery.data.total_participants} participants
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <span className="font-medium">
          {statsQuery.data.recent_submissions} submissions this week
        </span>
      </div>
    </div>
  );
};
