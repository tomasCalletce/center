"use client";

import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Clock, Mail } from "lucide-react";
import { type RouterOutputs } from "~/trpc/react";
import { format } from "date-fns";

type PendingInvitation = RouterOutputs["team"]["getTeamDetails"]["pendingInvitations"][number];

interface TeamPendingInvitationsProps {
  invitations: PendingInvitation[];
}

export function TeamPendingInvitations({ invitations }: TeamPendingInvitationsProps) {
  if (invitations.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-muted-foreground">
        No pending invitations
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => (
        <div
          key={invitation.id}
          className="flex items-center justify-between p-3 border rounded-lg bg-amber-50 border-amber-200"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {invitation.invitee.display_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {invitation.invitee.display_name}
                </span>
                <Mail className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="text-xs text-muted-foreground">
                Invited {format(new Date(invitation.created_at), "MMM d, yyyy")}
              </div>
              {invitation.message && (
                <div className="text-xs text-muted-foreground mt-1 italic">
                  "{invitation.message}"
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              Expires {format(new Date(invitation.expires_at), "MMM d")}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
} 