"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ExternalLink, Github, Users, Trophy, FileText } from "lucide-react";

interface ChallengeSubmissionsProps {
  slug: string;
}

export const ChallengeSubmissions: React.FC<ChallengeSubmissionsProps> = ({
  slug,
}) => {
  const submissionsQuery = api.challenge.getSubmissions.useQuery({
    challenge_slug: slug,
  });

  if (submissionsQuery.isLoading || !submissionsQuery.data) {
    return null;
  }

  if (submissionsQuery.data.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="mx-auto w-fit">
          <div className="from-slate-900/20 via-slate-900/10 border-slate-900/20 relative flex h-16 w-16 items-center justify-center rounded-2xl border bg-gradient-to-br to-transparent shadow-lg">
            <div className="from-slate-900 to-slate-900/80 rounded-xl bg-gradient-to-br p-3 shadow-inner">
              <FileText className="text-white h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">
            No team submissions yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your team hasn't submitted any projects for this challenge yet. Be
            the first to submit!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="from-slate-900/20 via-slate-900/10 border-slate-900/20 relative flex h-12 w-12 items-center justify-center rounded-xl border bg-gradient-to-br to-transparent shadow-lg">
          <div className="from-slate-900 to-slate-900/80 rounded-lg bg-gradient-to-br p-2 shadow-inner">
            <Trophy className="text-white h-5 w-5" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Team Submissions
          </h2>
          <p className="text-sm text-muted-foreground">
            {submissionsQuery.data.length} submission
            {submissionsQuery.data.length !== 1 ? "s" : ""} from your team
            {submissionsQuery.data.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissionsQuery.data.map((submission) => (
          <Card key={submission.id} className="h-full flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 flex-1 min-w-0">
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {submission.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    by {submission.submitted_by.display_name}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs shrink-0">
                  <Users className="h-3 w-3 mr-1" />
                  {submission.team.name}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Team
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {submission.team.name}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Submitted By
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {submission.submitted_by.display_name}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4 border-t">
                {submission.demo_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <Link
                      href={submission.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Demo
                    </Link>
                  </Button>
                )}

                {submission.repository_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <Link
                      href={submission.repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      View Code
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
