"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Users, Plus } from "lucide-react";
import { api, type RouterOutputs } from "~/trpc/react";
import { toast } from "sonner";
import type { TeamData } from "./submission-team-step";
import { TeamManagementInline } from "./team-management-inline";

interface SubmissionTeamSelectStepProps {
  challengeId: string;
  onNext: (data: TeamData) => void;
  onCreateNew: () => void;
}

export const SubmissionTeamSelectStep: React.FC<
  SubmissionTeamSelectStepProps
> = ({ challengeId, onNext, onCreateNew }) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  const userTeamsQuery = api.team.getUserTeams.useQuery({ challengeId });

  const handleSelectTeam = (
    team: RouterOutputs["team"]["getUserTeams"][number]
  ) => {
    if (team.hasSubmission) return;
    setSelectedTeamId(team.id);
  };

  const handleToggleTeamManagement = (teamId: string) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  const handleNext = () => {
    if (!selectedTeamId || !userTeamsQuery.data) {
      toast.error("Please select a team first");
      return;
    }

    const currentTeam = userTeamsQuery.data.find(
      (team) => team.id === selectedTeamId
    );
    if (!currentTeam) {
      toast.error("Team not found");
      return;
    }

    onNext({
      teamId: selectedTeamId,
      teamName: currentTeam.name,
      memberCount: currentTeam.memberCount,
    });
  };

  if (!userTeamsQuery.data || userTeamsQuery.data.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center pb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Create Your First Team
          </h3>
          <p className="text-sm text-slate-500">
            You don't have any teams yet. Create a team to participate in this
            challenge.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-lg bg-slate-100 flex items-center justify-center">
            <Users className="h-8 w-8 text-slate-600" />
          </div>
          <div className="flex justify-center">
            <Button onClick={onCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Team
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Select Your Team
        </h3>
        <p className="text-sm text-slate-500">
          Choose from your existing teams or create a new one
        </p>
      </div>

      <div className="space-y-3">
        {userTeamsQuery.data.map((team) => (
          <div
            key={team.id}
            className={`
              border border-dashed rounded-lg transition-all
              ${
                team.hasSubmission
                  ? "opacity-50 border-slate-200 bg-slate-50"
                  : selectedTeamId === team.id
                    ? "border-slate-900 bg-slate-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }
            `}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => handleSelectTeam(team)}
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{team.name}</div>
                    <div className="text-sm text-slate-500">
                      {team.memberCount} member{team.memberCount !== 1 ? 's' : ''} • Created {new Date(team.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedTeamId === team.id && (
                    <Badge variant="default">Selected</Badge>
                  )}
                  {team.hasSubmission && (
                    <Badge variant="secondary">Already Submitted</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="px-4 pb-4">
              <TeamManagementInline
                teamId={team.id}
                teamName={team.name}
                isExpanded={expandedTeamId === team.id}
                onToggle={() => handleToggleTeamManagement(team.id)}
              />
            </div>
          </div>
        ))}

        <div
          className="p-4 border border-dashed rounded-lg cursor-pointer transition-all border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          onClick={onCreateNew}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Plus className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <div className="font-medium text-slate-900">
                  Create New Team
                </div>
                <div className="text-sm text-slate-500">
                  Start a new team for this challenge
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedTeamId && (
        <div className="flex justify-end">
          <Button onClick={handleNext} size="lg">
            Continue with Team
          </Button>
        </div>
      )}
    </div>
  );
};
