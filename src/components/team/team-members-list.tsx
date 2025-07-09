"use client";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Crown, UserMinus } from "lucide-react";
import { api, type RouterOutputs } from "~/trpc/react";
import { toast } from "sonner";
import { format } from "date-fns";

type TeamMember = RouterOutputs["team"]["getTeamDetails"]["members"][number];

interface TeamMembersListProps {
  teamId: string;
  members: TeamMember[];
  userRole: "ADMIN" | "MEMBER";
  currentUserId: string;
  onMemberRemoved?: () => void;
}

export function TeamMembersList({
  teamId,
  members,
  userRole,
  currentUserId,
  onMemberRemoved,
}: TeamMembersListProps) {
  const utils = api.useUtils();

  const removeTeamMemberMutation = api.team.removeTeamMember.useMutation({
    onSuccess: () => {
      toast.success("Member removed successfully");
      utils.team.getTeamDetails.invalidate({ teamId });
      onMemberRemoved?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleRemoveMember = (memberClerkId: string) => {
    removeTeamMemberMutation.mutate({
      teamId,
      memberClerkId,
    });
  };

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between p-3 border rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {member.user?.display_name?.charAt(0)?.toUpperCase() || member._clerk?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {member.user?.display_name || "Member"}
                </span>
                {member.role === "ADMIN" && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              {member.user?.current_title && (
                <div className="text-xs text-muted-foreground">
                  {member.user.current_title}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Joined {format(new Date(member.joined_at), "MMM d, yyyy")}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={member.role === "ADMIN" ? "default" : "secondary"}>
              {member.role}
            </Badge>
            
            {userRole === "ADMIN" && 
             member._clerk !== currentUserId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveMember(member._clerk)}
                disabled={removeTeamMemberMutation.isPending}
              >
                <UserMinus className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 