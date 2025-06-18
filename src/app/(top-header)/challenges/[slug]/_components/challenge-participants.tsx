import { Users } from "lucide-react";
import { api } from "~/trpc/server";

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
          const initials = participant.user.display_name
            ? participant.user.display_name
                .split(" ")
                .map((name) => name[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
            : "A";

          return (
            <div
              key={participant.id}
              className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5 text-sm"
              title={participant.user.display_name || "Anonymous Developer"}
            >
              <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-medium">
                {initials}
              </div>
              <span className="text-sm">
                {participant.user.display_name?.split(" ")[0] || "Anonymous"}
              </span>
            </div>
          );
        })}

        {challengeParticipants.length > 8 && (
          <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5 text-sm">
            <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-medium">
              +{challengeParticipants.length - 8}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
