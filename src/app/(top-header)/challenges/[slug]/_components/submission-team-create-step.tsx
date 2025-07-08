"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Plus, ArrowLeft } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import type { TeamData } from "./submission-team-step";

interface SubmissionTeamCreateStepProps {
  challengeId: string;
  onNext: (data: TeamData) => void;
  onBack?: () => void;
}

export function SubmissionTeamCreateStep({
  challengeId,
  onNext,
  onBack,
}: SubmissionTeamCreateStepProps) {
  const [teamName, setTeamName] = useState("");

  const utils = api.useUtils();

  const createTeamMutation = api.team.createTeam.useMutation({
    onSuccess: (data) => {
      setTeamName("");
      toast.success("Team created successfully!");

      // Automatically proceed with the new team
      onNext({
        teamId: data.id,
        teamName: data.name,
        memberCount: 1,
      });

      utils.team.getUserTeams.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    createTeamMutation.mutate({
      name: teamName,
      challengeId,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && teamName.trim()) {
      handleCreateTeam();
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center pb-4 border-b border-dashed">
        <h3 className="text-lg font-semibold text-slate-900">
          Create Your Team
        </h3>
        <p className="text-sm text-slate-500">
          You'll be the team admin and can invite members later
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="teamName"
            className="text-sm font-medium text-slate-900"
          >
            Team Name
          </Label>
          <Input
            id="teamName"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={createTeamMutation.isPending}
          />
        </div>

        <div className="text-center text-xs text-slate-500">
          You can invite team members after creating the team
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-dashed">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={createTeamMutation.isPending}
              className="cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
          )}
          <div className="text-xs text-slate-500">Step 1 of 3 • Team Setup</div>
        </div>
        <Button
          onClick={handleCreateTeam}
          disabled={!teamName.trim()}
          isLoading={createTeamMutation.isPending}
          className="cursor-pointer px-6 shadow-lg"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </div>
    </div>
  );
}
