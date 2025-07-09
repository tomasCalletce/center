"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Users, UserPlus, Clock, X, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "~/trpc/react";
import { TeamMembersList } from "./team-members-list";
import { TeamPendingInvitations } from "./team-pending-invitations";
import { TeamInviteForm } from "./team-invite-form";
import { useUser } from "@clerk/nextjs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";

interface TeamManagementInlineProps {
  teamId: string;
  teamName: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export function TeamManagementInline({
  teamId,
  teamName,
  isExpanded,
  onToggle,
}: TeamManagementInlineProps) {
  const [activeTab, setActiveTab] = useState("members");
  const { user } = useUser();

  const teamDetailsQuery = api.team.getTeamDetails.useQuery(
    { teamId },
    { enabled: isExpanded }
  );

  const handleInviteSuccess = () => {
    setActiveTab("pending");
  };

  const handleMemberRemoved = () => {
    teamDetailsQuery.refetch();
  };

  if (!teamDetailsQuery.data && isExpanded) {
    return (
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-between">
            <span>Manage Team</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="text-center text-sm text-muted-foreground">
              Loading team details...
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  if (!teamDetailsQuery.data) {
    return (
      <Button variant="ghost" size="sm" className="w-full justify-between" onClick={onToggle}>
        <span>Manage Team</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
    );
  }

  const { members, pendingInvitations, userRole } = teamDetailsQuery.data;

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-between">
          <span>Manage Team</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-3 p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">{teamName}</h4>
            <Badge variant="outline">
              {members.length}/{teamDetailsQuery.data.max_members} members
            </Badge>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="members" className="gap-1 text-xs">
                <Users className="h-3 w-3" />
                Members
                <Badge variant="secondary" className="text-xs">{members.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-1 text-xs">
                <Clock className="h-3 w-3" />
                Pending
                <Badge variant="secondary" className="text-xs">{pendingInvitations.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="invite" className="gap-1 text-xs">
                <UserPlus className="h-3 w-3" />
                Invite
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="space-y-3 mt-4">
              <TeamMembersList
                teamId={teamId}
                members={members}
                userRole={userRole}
                currentUserId={user?.id || ""}
                onMemberRemoved={handleMemberRemoved}
              />
            </TabsContent>

            <TabsContent value="pending" className="space-y-3 mt-4">
              <TeamPendingInvitations invitations={pendingInvitations} />
            </TabsContent>

            <TabsContent value="invite" className="space-y-3 mt-4">
              {userRole === "ADMIN" ? (
                <TeamInviteForm
                  teamId={teamId}
                  onSuccess={handleInviteSuccess}
                  onCancel={() => setActiveTab("members")}
                />
              ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  Only team admins can send invitations
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
} 