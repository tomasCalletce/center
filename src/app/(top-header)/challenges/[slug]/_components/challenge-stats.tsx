"use client";

import { Users, Trophy, Calendar } from "lucide-react";
import { useIsMobile } from "~/hooks/use-mobile";

interface ChallengeStatsProps {
  stats: {
    total_submissions: number;
    total_participants: number;
    recent_submissions: number;
  };
}

export const ChallengeStats: React.FC<ChallengeStatsProps> = ({ stats }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  return (
    <div className="flex gap-6 text-sm text-muted-foreground px-4 py-1">
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4" />
        <span className="font-medium">
          {stats.total_submissions} submissions
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span className="font-medium">
          {stats.total_participants} participants
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <span className="font-medium">
          {stats.recent_submissions} submissions this week
        </span>
      </div>
    </div>
  );
};
