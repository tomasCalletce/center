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

  if (statsQuery.isLoading || !statsQuery.data) {
    return (
      <div className="p-3">
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-yellow-500/20 rounded-lg animate-pulse" />
            <div className="space-y-1">
              <div className="h-3 w-6 bg-white/20 rounded animate-pulse" />
              <div className="h-2 w-8 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-blue-500/20 rounded-lg animate-pulse" />
            <div className="space-y-1">
              <div className="h-3 w-6 bg-white/20 rounded animate-pulse" />
              <div className="h-2 w-8 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-green-500/20 rounded-lg animate-pulse" />
            <div className="space-y-1">
              <div className="h-3 w-6 bg-white/20 rounded animate-pulse" />
              <div className="h-2 w-8 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { total_submissions, recent_submissions, total_participants } =
    statsQuery.data;

  return (
    <div className="p-3">
      <div className="flex gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-yellow-500/20">
            <Trophy className="h-3 w-3 text-yellow-300" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              {total_submissions}
            </div>
            <div className="text-xs text-white/70">Submissions</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/20">
            <Users className="h-3 w-3 text-blue-300" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              {total_participants}
            </div>
            <div className="text-xs text-white/70">Participants</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-500/20">
            <Calendar className="h-3 w-3 text-green-300" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              {recent_submissions}
            </div>
            <div className="text-xs text-white/70">This week</div>
          </div>
        </div>
      </div>
    </div>
  );
};
