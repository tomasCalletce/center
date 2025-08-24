"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { BuildsGrid } from "./builds-grid";
import { ChallengeMarkdownClient } from "./challenge-markdown-client";
import { api } from "~/trpc/react";

interface ChallengeTabsProps {
  slug: string;
}

export const ChallengeTabs: React.FC<ChallengeTabsProps> = ({ slug }) => {
  const submissionsQuery = api.public.challenge.allSubmissions.useQuery({
    challenge_slug: slug,
    limit: 1,
  });

  const buildsCount = submissionsQuery.data?.totalCount ?? 0;

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <Tabs defaultValue="builds" className="w-full">
        <TabsList className="flex w-full gap-4 bg-transparent h-auto p-0 border-b border-border justify-start">
          <TabsTrigger 
            value="builds" 
            className="flex items-center gap-2 px-0 py-1.5 bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-base font-medium hover:text-foreground data-[state=active]:text-foreground text-muted-foreground transition-colors"
          >
            <span className="truncate">Builds</span>
            <div className="shrink-0 flex items-center gap-1">
              {buildsCount > 0 && (
                <span className="px-1.5 py-px text-xs font-semibold rounded-full bg-muted text-muted-foreground">
                  {buildsCount}
                </span>
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="details" 
            className="flex items-center gap-2 px-0 py-1.5 bg-transparent border-0 border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-base font-medium hover:text-foreground data-[state=active]:text-foreground text-muted-foreground transition-colors"
          >
            <span className="truncate">Details</span>
            <div className="shrink-0 flex items-center gap-1">
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builds" className="mt-6">
          <BuildsGrid slug={slug} />
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <ChallengeMarkdownClient slug={slug} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
