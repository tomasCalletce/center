import { Users } from "lucide-react";
import { api } from "~/trpc/server";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";

interface ChallengeParticipantsProps {
  _challenge: string;
}

export const ChallengeParticipants: React.FC<
  ChallengeParticipantsProps
> = async ({ _challenge }) => {
  const challengeParticipants = await api.public.challenge.participant({
    _challenge,
  });

  // Handle the case where challengeParticipants might be an empty array or Clerk response
  const participants = Array.isArray(challengeParticipants) 
    ? challengeParticipants 
    : challengeParticipants.data || [];

  return (
    <div className="flex gap-6">
      <div className="border-r border-border/60 pr-6 min-w-fit">
        <div className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Participants
            </h2>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 flex-1">
        {participants.map((participant: any) => (
          <div key={participant.id} className="flex items-center gap-2">
            <Avatar className="h-8 w-8 ring-2 ring-background shadow-sm">
              <AvatarImage
                src={participant.imageUrl}
                alt={participant.fullName || "N/A"}
                className="object-cover"
              />
              <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-primary/20 to-primary/10">
                ACC
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {participant.fullName || participant.firstName || "Anonymous"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
