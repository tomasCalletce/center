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
  hasExistingTeams: boolean;
}

export function SubmissionTeamCreateStep({
  challengeId,
  onNext,
  onBack,
  hasExistingTeams,
}: SubmissionTeamCreateStepProps) {
  const [teamName, setTeamName] = useState("");

  const utils = api.useUtils();

  const createTeamMutation = api.team.createTeam.useMutation({
    onSuccess: (data) => {
      setTeamName("");
      toast.success("Team created successfully!");
      utils.team.getUserTeams.invalidate();
      
      // Automatically proceed with the new team
      onNext({
        teamId: data.id,
        teamName: data.name,
        memberCount: 1,
      });
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
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium">Create Your Team</h3>
        <p className="text-sm text-muted-foreground">
          {hasExistingTeams 
            ? "Create a new team for this submission."
            : "You'll be the team admin and can invite members later."
          }
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div className="space-y-2">
          <Label htmlFor="teamName">Team Name</Label>
          <Input
            id="teamName"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={createTeamMutation.isPending}
          />
        </div>
        
        <div className="flex gap-2">
          {hasExistingTeams && onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              disabled={createTeamMutation.isPending}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Teams
            </Button>
          )}
          
          <Button
            onClick={handleCreateTeam}
            disabled={!teamName.trim() || createTeamMutation.isPending}
            className="flex-1 gap-2"
          >
            {createTeamMutation.isPending ? (
              "Creating..."
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Team
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        You can invite team members after creating the team
      </div>
    </div>
  );
}