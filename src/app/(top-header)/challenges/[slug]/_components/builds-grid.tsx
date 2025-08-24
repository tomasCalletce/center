"use client";

import Image from "next/image";
import { api } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import { Clock, Users, FileText, ExternalLink, Github } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { buttonVariants } from "~/components/ui/button";
import Link from "next/link";
import { cn } from "~/lib/utils";

interface BuildsGridProps {
  slug: string;
}

export const BuildsGrid: React.FC<BuildsGridProps> = ({ slug }) => {
  const submissionsQuery = api.public.challenge.allSubmissions.useQuery({
    challenge_slug: slug,
    limit: 50,
  });

  if (submissionsQuery.isLoading) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 sm:p-4 rounded-lg border bg-card animate-pulse"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-md bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-2/3" />
                <div className="h-7 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (submissionsQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground">
            Error loading builds
          </h3>
          <p className="text-sm text-muted-foreground">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  if (!submissionsQuery.data?.submissions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground">
            No builds yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Be the first to submit your build for this challenge
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {submissionsQuery.data.submissions.map((submission) => (
          <div
            key={submission.id}
            className="group flex gap-3 p-3 sm:p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200"
          >
            <div className="flex-shrink-0 relative w-16 h-16 rounded-md overflow-hidden bg-muted">
              {submission.logo_image?.url ? (
                <Image
                  src={submission.logo_image.url}
                  alt={submission.logo_image.alt ?? "Build Logo"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                  {submission.title}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {submission.team?.name || "Unknown Team"}
                </span>
              </div>

              <div className="text-xs text-muted-foreground truncate">
                by {submission.submitted_by?.display_name || "Unknown User"}
              </div>

              <Badge variant="outline" className="text-xs w-fit">
                <Clock className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">
                  {formatDistanceToNow(
                    toZonedTime(
                      new Date(submission.created_at),
                      Intl.DateTimeFormat().resolvedOptions().timeZone
                    ),
                    { addSuffix: true }
                  )}
                </span>
                <span className="sm:hidden">
                  {formatDistanceToNow(
                    toZonedTime(
                      new Date(submission.created_at),
                      Intl.DateTimeFormat().resolvedOptions().timeZone
                    ),
                    { addSuffix: true }
                  ).replace(' ago', '')}
                </span>
              </Badge>

              {(submission.demo_url || submission.repository_url) && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {submission.demo_url && (
                    <Link
                      href={submission.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "flex items-center justify-center gap-1 text-xs h-6 px-2"
                      )}
                    >
                      <ExternalLink className="h-2.5 w-2.5" />
                      Demo
                    </Link>
                  )}
                  {submission.repository_url && (
                    <Link
                      href={submission.repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "flex items-center justify-center gap-1 text-xs h-6 px-2"
                      )}
                    >
                      <Github className="h-2.5 w-2.5" />
                      Code
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {submissionsQuery.data.totalCount > submissionsQuery.data.submissions.length && (
        <div className="flex justify-center pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {submissionsQuery.data.submissions.length} of{" "}
            {submissionsQuery.data.totalCount} builds
          </p>
        </div>
      )}
    </div>
  );
};
