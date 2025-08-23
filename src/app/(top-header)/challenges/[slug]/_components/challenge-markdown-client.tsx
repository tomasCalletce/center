"use client";

import { api } from "~/trpc/react";
import { MDXRendererClient } from "~/components/mdx-renderer-client";
import { Separator } from "~/components/ui/separator";

interface ChallengeMarkdownClientProps {
  slug: string;
}

export const ChallengeMarkdownClient: React.FC<ChallengeMarkdownClientProps> = ({ 
  slug 
}) => {
  const challengeQuery = api.public.challenge.details.useQuery({
    challenge_slug: slug,
  });

  if (challengeQuery.isLoading) {
    return (
      <div className="w-full max-w-none space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-3/4" />
        <Separator />
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-4/5" />
          <div className="h-4 bg-muted rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (challengeQuery.isError || !challengeQuery.data) {
    return (
      <div className="w-full max-w-none space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Error Loading Challenge</h1>
        <Separator />
        <p className="text-muted-foreground">
          Unable to load challenge details. Please try again later.
        </p>
      </div>
    );
  }

  const challenge = challengeQuery.data;

  return (
    <div className="w-full max-w-none space-y-4">
      <h1 className="text-3xl font-bold text-foreground">{challenge.title}</h1>
      <Separator />
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full" />
        <div className="pl-6">
          <MDXRendererClient content={challenge.markdown} />
        </div>
      </div>
    </div>
  );
};
