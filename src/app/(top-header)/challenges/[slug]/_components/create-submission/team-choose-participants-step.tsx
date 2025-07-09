"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Users, UserPlus, ArrowLeft, Mail, Crown, User } from "lucide-react";
import { api } from "~/trpc/react";
import { useUser } from "@clerk/nextjs";
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
    teamId: teamData.id,
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
      email: email.trim(),
    });
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
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>
            </div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-900">Team Members</h4>
            <Badge variant="outline">
              {members.length}/{teamDetailsQuery.data.max_members} members
            </Badge>
          </div>

          <ScrollArea className="h-[200px]">
            <div className="space-y-2 pr-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border border-dashed rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 text-sm">
                        {member.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {member.email}
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

              {teamDetailsQuery.data?.pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-3 border border-dashed rounded-lg bg-amber-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 text-sm">
                        {invitation.email}
                      </div>
                      <div className="text-xs text-slate-500">
                        Invitation sent
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Pending
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
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
