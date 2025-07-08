"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Users, Plus } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import type { TeamData } from "./submission-team-step";

interface SubmissionTeamSelectStepProps {
  challengeId: string;
  onNext: (data: TeamData) => void;
  onCreateNew: () => void;
}

export const SubmissionTeamSelectStep: React.FC<
  SubmissionTeamSelectStepProps
> = ({ challengeId, onNext, onCreateNew }) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const userTeamsQuery = api.team.getUserTeams.useQuery({ challengeId });
  const teamDetailsQuery = api.team.getTeamDetails.useQuery(
    { teamId: selectedTeamId! },
    { enabled: !!selectedTeamId }
  );

  const handleSelectTeam = (team: any) => {
    if (team.hasSubmission) return;
    setSelectedTeamId(team.id);
  };

  const handleNext = () => {
    if (!selectedTeamId) {
      toast.error("Please select a team first");
      return;
    }

    const currentTeam = teamDetailsQuery.data;
    if (!currentTeam) {
      toast.error("Unable to load team details");
      return;
    }

    onNext({
      teamId: selectedTeamId,
      teamName: currentTeam.name,
      memberCount: currentTeam.members.length,
    });
  };

  if (!userTeamsQuery.data || userTeamsQuery.data.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-lg bg-slate-100 flex items-center justify-center">
            <Users className="h-8 w-8 text-slate-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Create Your First Team</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You don't have any teams yet. Create a team to participate in this
              challenge.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={onCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Team
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium">Select Your Team</h3>
        <p className="text-sm text-muted-foreground">
          Choose from your existing teams or create a new one
        </p>
      </div>

      <div className="space-y-3">
        {userTeamsQuery.data.map((team) => (
          <div
            key={team.id}
            className={`
              p-4 border rounded-lg cursor-pointer transition-colors
              ${
                team.hasSubmission
                  ? "opacity-50 cursor-not-allowed border-slate-200 bg-slate-50"
                  : selectedTeamId === team.id
                    ? "border-slate-900 bg-slate-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }
            `}
            onClick={() => handleSelectTeam(team)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <div className="font-medium">{team.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Created {new Date(team.created_at).toLocaleDateString()}
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
        ))}
      </div>

      <div className="text-center pt-2">
        <Button variant="outline" onClick={onCreateNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Team
        </Button>
      </div>

      {selectedTeamId && (
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleNext} size="lg">
            Continue with Team
          </Button>
        </div>
      )}
    </div>
  );
};
