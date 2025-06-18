import { Users } from "lucide-react";
import { api } from "~/trpc/server";
import { formatDistanceToNow } from "date-fns";

interface ChallengeParticipantsProps {
  slug: string;
}

export const ChallengeParticipants: React.FC<
  ChallengeParticipantsProps
> = async ({ slug }) => {
  const challengeParticipants = await api.public.challenge.participants({
    challenge_slug: slug,
  });

  return (
    <div className="border border-dashed rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">
          {challengeParticipants.length} joined
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {challengeParticipants.slice(0, 8).map((participant) => {
          const joinedTime = formatDistanceToNow(
            new Date(participant.created_at),
            {
              addSuffix: true,
            }
          );

          return (
            <div
              key={participant.id}
              className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 border transition-all hover:scale-105"
            >
              <div className="w-2 h-2 rounded-full bg-foreground/30"></div>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-tight">
                  {participant.user.display_name || "Anonymous Developer"}
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  {joinedTime}
                </span>
              </div>
            </div>
          );
        })}

        {challengeParticipants.length > 8 && (
          <div className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 border">
            <div className="w-2 h-2 rounded-full bg-foreground/30"></div>
            <span className="text-sm font-medium">
              +{challengeParticipants.length - 8} more
            </span>
          </div>
        )}

        {challengeParticipants.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No participants yet - be the first!
          </div>
        )}
      </div>
    </div>
  );
};
