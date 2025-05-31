import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Users, Star } from "lucide-react";

// Dummy participant data
const participants = [
  {
    id: 1,
    name: "Alex Chen",
    username: "@alexchen",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    rank: 1,
    isTopPerformer: true,
  },
  {
    id: 2,
    name: "Sarah Kim",
    username: "@sarahk",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    rank: 2,
    isTopPerformer: true,
  },
  {
    id: 3,
    name: "Marcus Johnson",
    username: "@marcusj",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    joinedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    rank: 3,
    isTopPerformer: true,
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    username: "@emmar",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    joinedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    rank: 4,
    isTopPerformer: false,
  },
  {
    id: 5,
    name: "David Park",
    username: "@davidp",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    joinedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    rank: 5,
    isTopPerformer: false,
  },
  {
    id: 6,
    name: "Lisa Wang",
    username: "@lisaw",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    joinedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    rank: 6,
    isTopPerformer: false,
  },
];

export const ChallengeParticipants = () => {
  return (
    <div className="flex gap-6">
      {/* Header */}
      <div className="border-r border-border/60 pr-6 min-w-fit">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Participants
          </h2>
        </div>
        <p className="text-muted-foreground text-sm">
          {participants.length} talented developers competing
        </p>
      </div>

      {/* Participants Grid */}
      <div className="flex flex-wrap gap-4 flex-1">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="group relative flex items-center gap-3 p-3 rounded-lg border border-border/40 hover:border-border hover:bg-accent/50 transition-all duration-200 min-w-fit"
          >
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                <AvatarImage
                  src={participant.avatar}
                  alt={participant.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-primary/20 to-primary/10">
                  {participant.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {participant.isTopPerformer && (
                <div className="absolute -top-1 -right-1 p-1 bg-amber-100 rounded-full">
                  <Star className="h-3 w-3 text-amber-600 fill-amber-600" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-foreground truncate text-sm">
                  {participant.name}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {participant.username}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
