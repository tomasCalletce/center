import { Users } from "lucide-react";
import { api } from "~/trpc/server";
import { ProfileCard } from "~/components/ui/profile-card";

interface ChallengeParticipantsProps {
  _challenge: string;
}

export const ChallengeParticipants: React.FC<
  ChallengeParticipantsProps
> = async ({ _challenge }) => {
  const { data: challengeParticipants } = await api.challenge.participant({
    _challenge,
  });

  return (
    <div className="flex gap-6">
      {/* Header */}
      <div className="border-r border-border/60 pr-6 min-w-fit">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Participants
          </h2>
        </div>
        <p className="text-muted-foreground text-sm">
          {challengeParticipants.length} talented developers competing
        </p>
      </div>
      <div className="flex flex-wrap gap-4 flex-1">
        {challengeParticipants.map((participant) => (
          <ProfileCard
            key={participant.id}
            user={participant}
            className="min-w-fit flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
};
