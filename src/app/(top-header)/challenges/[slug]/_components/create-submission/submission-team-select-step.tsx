"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Users, Plus, ArrowRight } from "lucide-react";
import { api, type RouterOutputs } from "~/trpc/react";
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

  const userTeamsQuery = api.team.getUserTeams.useQuery({
    _challenge: challengeId,
  });

  const handleSelectTeam = (
    team: RouterOutputs["team"]["getUserTeams"][number]
  ) => {
    if (team.hasSubmission) return;
    setSelectedTeamId(team.id);
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
      <ScrollArea className="h-[400px]">
        <div className="space-y-3 pr-4">
          <div
            className="p-4 border border-dashed rounded-lg cursor-pointer border-slate-200"
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

          {userTeamsQuery.data?.map((team) => (
            <div
              key={team.id}
              className={`
                border border-dashed rounded-lg
                ${
                  team.hasSubmission
                    ? "opacity-50 border-slate-200 bg-slate-50"
                    : selectedTeamId === team.id
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-200"
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
                      <div className="font-medium text-slate-900">
                        {team.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {team.memberCount} member
                        {team.memberCount !== 1 ? "s" : ""} • Created{" "}
                        {new Date(team.created_at).toLocaleDateString()}
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
            </div>
          ))}
        </div>
      </ScrollArea>

      {selectedTeamId && (
        <div className="flex justify-end">
          <Button onClick={handleNext} size="lg">
            Continue with Team
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
