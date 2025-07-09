"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Users, UserPlus, Clock, Settings } from "lucide-react";
import { api } from "~/trpc/react";
import { TeamMembersList } from "./team-members-list";
import { TeamPendingInvitations } from "./team-pending-invitations";
import { TeamInviteForm } from "./team-invite-form";
import { useUser } from "@clerk/nextjs";

interface TeamManagementModalProps {
  teamId: string;
  teamName: string;
  trigger: React.ReactNode;
}

export function TeamManagementModal({
  teamId,
  teamName,
  trigger,
}: TeamManagementModalProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("members");
  const { user } = useUser();

  const teamDetailsQuery = api.team.getTeamDetails.useQuery(
    { teamId },
    { enabled: open }
  );

  const handleInviteSuccess = () => {
    setActiveTab("pending");
  };

  const handleMemberRemoved = () => {
    teamDetailsQuery.refetch();
  };

  if (!teamDetailsQuery.data) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Loading team details...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const { members, pendingInvitations, userRole } = teamDetailsQuery.data;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Manage {teamName}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="members" className="gap-2">
              <Users className="h-4 w-4" />
              Members
              <Badge variant="secondary">{members.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pending
              <Badge variant="secondary">{pendingInvitations.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="invite" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <Badge variant="outline">
                {members.length}/{teamDetailsQuery.data.max_members} members
              </Badge>
            </div>
            <TeamMembersList
              teamId={teamId}
              members={members}
              userRole={userRole}
              currentUserId={user?.id || ""}
              onMemberRemoved={handleMemberRemoved}
            />
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Pending Invitations</h3>
              <Badge variant="outline">{pendingInvitations.length} pending</Badge>
            </div>
            <TeamPendingInvitations invitations={pendingInvitations} />
          </TabsContent>

          <TabsContent value="invite" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Invite New Members</h3>
              <Badge variant="outline">
                {teamDetailsQuery.data.max_members - members.length} slots available
              </Badge>
            </div>
            
            {userRole === "ADMIN" ? (
              <TeamInviteForm
                teamId={teamId}
                onSuccess={handleInviteSuccess}
                onCancel={() => setActiveTab("members")}
              />
            ) : (
              <div className="text-center py-6 text-sm text-muted-foreground">
                Only team admins can send invitations
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 