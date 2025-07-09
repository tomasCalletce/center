"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Plus, ArrowLeft } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";

interface TeamChooseNameStepProps {
  challengeId: string;
  onNext: (teamData: { id: string; name: string }) => void;
  onBack?: () => void;
}

export function TeamChooseNameStep({
  challengeId,
  onNext,
  onBack,
}: TeamChooseNameStepProps) {
  const [teamName, setTeamName] = useState("");

  const createTeamMutation = api.team.createTeam.useMutation({
    onSuccess: (data) => {
      toast.success("Team created successfully!");
      onNext({ id: data.id, name: data.name });
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Create Your Team
        </h3>
        <p className="text-sm text-slate-500">
          Enter your team name to get started
        </p>
      </div>

      <div className="space-y-3">
        <div className="border border-dashed rounded-lg border-slate-200">
          <div className="p-4">
            <div className="space-y-3">
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
            </div>
          </div>
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
          size="lg"
        >
          Create Team
          <Plus className="h-4 w-4 mr-2" />
        </Button>
      </div>
    </div>
  );
}
