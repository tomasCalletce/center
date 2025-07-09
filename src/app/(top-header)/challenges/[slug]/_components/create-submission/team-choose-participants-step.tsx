"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { UserPlus, ArrowLeft, Crown, User, Clock } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import type { TeamData } from "~/app/(top-header)/challenges/[slug]/_components/create-submission/submission-team-step";

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
  const [email, setEmail] = useState("");

  const teamDetailsQuery = api.team.getTeamDetails.useQuery({
    _team: teamData.id,
  });

  const inviteMutation = api.team.sendInvitation.useMutation({
    onSuccess: () => {
      setEmail("");
      toast.success("Invitation sent successfully!");
      teamDetailsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleInvite = () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    inviteMutation.mutate({
      _team: teamData.id,
      emails: email,
    });
  };

  const handleProceed = () => {
    const memberCount = teamDetailsQuery.data?.teammates.length || 1;
    onNext({
      teamId: teamData.id,
      teamName: teamData.name,
      memberCount,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Add team members to {teamData.name}
        </h3>
        <p className="text-sm text-slate-500">
          Invite members by email or continue with just yourself
        </p>
      </div>

      <div className="space-y-6">
        {/* Invite Input */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-slate-900"
            >
              Invite by email
            </Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                />
              </div>
              <Button
                onClick={handleInvite}
                disabled={!email.trim()}
                isLoading={inviteMutation.isPending}
              >
                Invite
                <UserPlus className="h-4 w-4 mr-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Current Team Members */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-900">
              Current Team Members
            </h4>
            <Badge variant="outline">
              {teamDetailsQuery.data?.teammates.length || 0} members
            </Badge>
          </div>

          <div className="space-y-2">
            {teamDetailsQuery.data?.teammates.map((member) => (
              <div
                key={member._clerk}
                className="flex items-center justify-between p-3 border border-dashed rounded-lg bg-green-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 text-sm">
                      {member.display_name}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={member.role === "ADMIN" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {member.role === "ADMIN" ? (
                    <>
                      <Crown className="h-3 w-3 mr-1" />
                      Admin
                    </>
                  ) : (
                    "Member"
                  )}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Invitations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-900">
              Pending Invitations
            </h4>
            <Badge variant="outline">
              {teamDetailsQuery.data?.pendingInvitations.length || 0} pending
            </Badge>
          </div>

          <div className="space-y-2">
            {teamDetailsQuery.data?.pendingInvitations.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-500">
                No pending invitations
              </div>
            ) : (
              teamDetailsQuery.data?.pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-3 border border-dashed rounded-lg bg-yellow-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 text-sm">
                        Invitation sent
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(invitation.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Pending
                  </Badge>
                </div>
              ))
            )}
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
        <Button onClick={handleProceed}>Continue with Team</Button>
      </div>
    </div>
  );
}
