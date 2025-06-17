"use client";

import { useState } from "react";
import { ChallengeList } from "~/app/admin/_components/challenge-list";
import { ChallengeForm } from "~/app/admin/_components/challenge-form";

type AdminView = "list" | "create" | "edit";

export default function Admin() {
  const [currentView, setCurrentView] = useState<AdminView>("list");
  const [editingChallengeId, setEditingChallengeId] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingChallengeId(null);
    setCurrentView("create");
  };

  const handleEditChallenge = (challengeId: string) => {
    setEditingChallengeId(challengeId);
    setCurrentView("edit");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setEditingChallengeId(null);
  };

  const handleSuccess = () => {
    setCurrentView("list");
    setEditingChallengeId(null);
  };

  return (
    <div className="w-full px-6 py-4">
      {currentView === "list" && (
        <ChallengeList
          onCreateNew={handleCreateNew}
          onEditChallenge={handleEditChallenge}
        />
      )}
      
      {(currentView === "create" || currentView === "edit") && (
        <ChallengeForm
          challengeId={editingChallengeId || undefined}
          onSuccess={handleSuccess}
          onCancel={handleBackToList}
        />
      )}
    </div>
  );
}
