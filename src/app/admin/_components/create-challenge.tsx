"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { challengeVisibilityValues } from "~/server/db/schemas/challenges";
import Editor from "./mdx-editor";

export const CreateChallenge = () => {
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const [pricePool, setPricePool] = useState<number>(100);
  const [deadline, setDeadline] = useState<string>("");
  
  const createChallengeMutation = api.challenge.create.useMutation({
    onSuccess: () => {
      // Reset form after successful creation
      setMarkdown("");
      setTitle("");
      setPricePool(100);
      setDeadline("");
    },
  });

  const handleCreateChallenge = () => {
    if (!title.trim() || !markdown.trim() || !deadline) {
      alert("Please fill in all required fields");
      return;
    }

    createChallengeMutation.mutate({
      title: title.trim(),
      markdown: markdown.trim(),
      visibility: challengeVisibilityValues.VISIBLE,
      price_pool: pricePool,
      price_pool_currency: "USD",
      deadline_at: new Date(deadline),
      imageData: {
        url: "/ai-hackathon.jpeg", // Temporary placeholder from public folder
        pathname: "ai-hackathon.jpeg",
        alt: title.trim(),
      },
    });
  };

  return (
    <div className="space-y-6">
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
        onClick={handleCreateChallenge}
        disabled={createChallengeMutation.isPending}
      >
        {createChallengeMutation.isPending ? "Creating..." : "Create Challenge"}
      </Button>
    </div>
  );
};
