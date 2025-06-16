"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { challengeVisibilityValues } from "~/server/db/schemas/challenges";
import Editor from "./mdx-editor";

interface ChallengeFormProps {
  challengeId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ChallengeForm = ({ challengeId, onSuccess, onCancel }: ChallengeFormProps) => {
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const [pricePool, setPricePool] = useState<number>(100);
  const [deadline, setDeadline] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const isEditing = !!challengeId;

  // Fetch challenge data if editing
  const { data: challengeData, isLoading: isFetchingChallenge } = api.challenge.details.useQuery(
    { _challenge: challengeId! },
    { enabled: isEditing }
  );

  // Populate form when editing and data is loaded
  useEffect(() => {
    if (isEditing && challengeData) {
      setTitle(challengeData.title);
      setMarkdown(challengeData.markdown);
      setPricePool(challengeData.price_pool);
      // Format deadline for datetime-local input
      const deadlineDate = new Date(challengeData.deadline_at);
      const formattedDeadline = deadlineDate.toISOString().slice(0, 16);
      setDeadline(formattedDeadline);
    }
  }, [isEditing, challengeData]);

  const createChallengeMutation = api.challenge.create.useMutation({
    onSuccess: () => {
      setMarkdown("");
      setTitle("");
      setPricePool(100);
      setDeadline("");
      onSuccess?.();
    },
  });

  const updateChallengeMutation = api.challenge.update.useMutation({
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const handleSubmit = async () => {
    if (!title.trim() || !markdown.trim() || !deadline) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        await updateChallengeMutation.mutateAsync({
          id: challengeId,
          title: title.trim(),
          markdown: markdown.trim(),
          visibility: challengeVisibilityValues.VISIBLE,
          price_pool: pricePool,
          price_pool_currency: "USD",
          deadline_at: new Date(deadline),
        });
      } else {
        await createChallengeMutation.mutateAsync({
          title: title.trim(),
          markdown: markdown.trim(),
          visibility: challengeVisibilityValues.VISIBLE,
          price_pool: pricePool,
          price_pool_currency: "USD",
          deadline_at: new Date(deadline),
        });
      }
    } catch (error) {
      console.error("Failed to save challenge:", error);
    } finally {
      setLoading(false);
    }
  };

  const isPending = createChallengeMutation.isPending || updateChallengeMutation.isPending || loading;

  if (isEditing && isFetchingChallenge) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center">
        <div className="text-gray-500">Loading challenge data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Challenge" : "Create New Challenge"}
        </h1>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Challenge Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter challenge title"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="pricePool">Price Pool (USD)</Label>
          <Input
            id="pricePool"
            type="number"
            value={pricePool}
            onChange={(e) => setPricePool(Number(e.target.value))}
            placeholder="100"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Challenge Content</h2>
        <Editor 
          markdown={markdown}
          onChange={setMarkdown}
        />
      </div>
      
      <Button 
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full"
      >
        {isPending ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Challenge" : "Create Challenge")}
      </Button>
    </div>
  );
}; 