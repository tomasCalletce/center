"use client";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";

export const CreateChallenge = () => {
  const createChallengeMutation = api.challenge.create.useMutation();

  return (
    <div>
      <Button onClick={() => createChallengeMutation.mutate()}>
        Create Challenge
      </Button>
    </div>
  );
};
