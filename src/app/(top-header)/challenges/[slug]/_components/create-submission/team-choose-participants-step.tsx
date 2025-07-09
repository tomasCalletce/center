"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Users, UserPlus, Clock, ArrowLeft } from "lucide-react";
import { api } from "~/trpc/react";
import { TeamMembersList } from "~/app/(top-header)/challenges/[slug]/_components/team-members-list";
import { TeamPendingInvitations } from "~/app/(top-header)/challenges/[slug]/_components/team-pending-invitations";
import { TeamInviteForm } from "~/app/(top-header)/challenges/[slug]/_components/team-invite-form";
import { useUser } from "@clerk/nextjs";
import type { TeamData } from "~/app/(top-header)/challenges/[slug]/_components/create-submission/submission-team-step";
import { ArrowRight } from "lucide-react";

interface TeamChooseParticipantsStepProps {
  teamData: { id: string; name: string };
  onNext: (data: TeamData) => void;
  onBack: () => void;
}

export function TeamChooseParticipantsStep({
  teamData,
  onNext,
  onBack,
}: TeamChooseParticipantsStepProps) {
  const [activeTab, setActiveTab] = useState("members");
  const { user } = useUser();

  const teamDetailsQuery = api.team.getTeamDetails.useQuery({
    teamId: teamData.id,
  });

  const handleInviteSuccess = () => {
    setActiveTab("pending");
  };

  const handleMemberRemoved = () => {
    teamDetailsQuery.refetch();
  };

  const handleProceed = () => {
    const memberCount = teamDetailsQuery.data?.members.length || 1;
    onNext({
      teamId: teamData.id,
      teamName: teamData.name,
      memberCount,
    });
  };

  if (!teamDetailsQuery.data) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Loading Team Details...
          </h3>
        </div>
        <div className="flex justify-center py-8">
          <div className="text-center text-sm text-muted-foreground">
            Loading team details...
          </div>
        </div>
      </div>
    );
  }

  const { members, pendingInvitations, userRole } = teamDetailsQuery.data;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Invite Team Members
        </h3>
        <p className="text-sm text-slate-500">
          Add members to your team or continue with just yourself
        </p>
      </div>

      <div className="space-y-3">
        <div className="border border-dashed rounded-lg border-slate-900 bg-slate-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    {teamData.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    {members.length} member{members.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
              <Badge variant="outline">
                {members.length}/{teamDetailsQuery.data.max_members} members
              </Badge>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="members" className="gap-1 text-xs">
                  <Users className="h-3 w-3" />
                  Members
                  <Badge variant="secondary" className="text-xs">
                    {members.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  Pending
                  <Badge variant="secondary" className="text-xs">
                    {pendingInvitations.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="invite" className="gap-1 text-xs">
                  <UserPlus className="h-3 w-3" />
                  Invite
                </TabsTrigger>
              </TabsList>

              <TabsContent value="members" className="space-y-3 mt-4">
                <TeamMembersList
                  teamId={teamData.id}
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
                    teamId={teamData.id}
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
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-dashed">
        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-xs text-slate-500">Step 1 of 3 • Team Setup</div>
        </div>
        <Button onClick={handleProceed} isLoading={teamDetailsQuery.isPending}>
          Continue with Team
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
