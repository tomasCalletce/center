"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Plus, ArrowLeft } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import type { TeamData } from "./submission-team-step";
import { TeamManagementInline } from "~/app/(top-header)/challenges/[slug]/_components/team-management-inline";

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
  const [createdTeam, setCreatedTeam] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isManagementExpanded, setIsManagementExpanded] = useState(false);

  const utils = api.useUtils();

  const createTeamMutation = api.team.createTeam.useMutation({
    onSuccess: (data) => {
      setTeamName("");
      setCreatedTeam({ id: data.id, name: data.name });
      toast.success("Team created successfully!");
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

  const handleProceedWithTeam = () => {
    if (!createdTeam) return;

    onNext({
      teamId: createdTeam.id,
      teamName: createdTeam.name,
      memberCount: 1,
    });
  };

  if (createdTeam) {
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        <div className="text-center pb-4 border-b border-dashed">
          <h3 className="text-lg font-semibold text-slate-900">
            Team Created Successfully!
          </h3>
          <p className="text-sm text-slate-500">
            Your team "{createdTeam.name}" is ready. You can invite members or
            continue with your submission.
          </p>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-lg bg-green-100 flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-green-600" />
            </div>
            <div className="font-medium text-slate-900 mb-2">
              {createdTeam.name}
            </div>
            <div className="text-sm text-slate-500">1 member (you)</div>
          </div>

          <div className="space-y-2">
            <TeamManagementInline
              teamId={createdTeam.id}
              teamName={createdTeam.name}
              isExpanded={isManagementExpanded}
              onToggle={() => setIsManagementExpanded(!isManagementExpanded)}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-dashed">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Teams
              </Button>
            )}
            <div className="text-xs text-slate-500">
              Step 1 of 3 • Team Setup
            </div>
          </div>
          <Button
            onClick={handleProceedWithTeam}
            className="cursor-pointer px-6 shadow-lg"
            size="lg"
          >
            Continue with Team
          </Button>
        </div>
      </div>
    );
  }

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
