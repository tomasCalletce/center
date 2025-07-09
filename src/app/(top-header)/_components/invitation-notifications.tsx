"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Bell, Check, X, Users } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { teamInvitationStatusValues } from "~/server/db/schemas/team-invitations";

const AcceptButton: React.FC<{
  invitationId: string;
}> = ({ invitationId }) => {
  const trpcUtils = api.useUtils();
  const acceptMutation = api.team.respondToInvitation.useMutation({
    onSuccess: () => {
      toast.success("Invitation accepted!");
      trpcUtils.team.getInvitations.invalidate();
    },
    onError: () => {
      toast.error("Failed to accept invitation");
    },
  });

  const handleAccept = () => {
    acceptMutation.mutate({
      _invitation: invitationId,
      response: teamInvitationStatusValues.ACCEPTED,
    });
  };

  return (
    <Button
      size="sm"
      onClick={handleAccept}
      disabled={acceptMutation.isPending}
      isLoading={acceptMutation.isPending}
    >
      Accept
      <Check className="h-3 w-3" />
    </Button>
  );
};

const DeclineButton: React.FC<{
  invitationId: string;
}> = ({ invitationId }) => {
  const trpcUtils = api.useUtils();
  const declineMutation = api.team.respondToInvitation.useMutation({
    onSuccess: () => {
      toast.success("Invitation declined!");
      trpcUtils.team.getInvitations.invalidate();
    },
    onError: () => {
      toast.error("Failed to decline invitation");
    },
  });

  const handleDecline = () => {
    declineMutation.mutate({
      _invitation: invitationId,
      response: teamInvitationStatusValues.DECLINED,
    });
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleDecline}
      disabled={declineMutation.isPending}
      isLoading={declineMutation.isPending}
    >
      Decline
      <X className="h-3 w-3 mr-1" />
    </Button>
  );
};

export const InvitationNotifications: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const invitationsQuery = api.team.getInvitations.useQuery(undefined, {
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  if (!invitationsQuery.data) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {invitationsQuery.data.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {invitationsQuery.data?.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Team Invitations
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {invitationsQuery.data.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No pending invitations
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {invitationsQuery.data.map((invitation) => (
              <div key={invitation.id} className="p-4 border-b last:border-b-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {invitation.inviter.display_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">
                          {invitation.inviter.display_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          invited you to join
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm font-medium">
                    {invitation.team.name}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Expires {format(invitation.expires_at, "MMM d, yyyy")}
                    </div>
                    <div className="flex gap-2">
                      <DeclineButton invitationId={invitation.id} />
                      <AcceptButton invitationId={invitation.id} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
