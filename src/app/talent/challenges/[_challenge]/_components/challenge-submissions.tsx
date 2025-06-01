import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/server";
import {
  Trophy,
  Eye,
  Github,
  Play,
  ExternalLink,
  Clock,
  EyeOff,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { buttonVariants } from "~/components/ui/button";

interface ChallengeSubmissionsProps {
  _challenge: string;
}

export const ChallengeSubmissions: React.FC<
  ChallengeSubmissionsProps
> = async ({ _challenge }) => {
  const allSubmissions = await api.challenge.allSubmissions({ _challenge });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Submissions
            </h2>
            <p className="text-sm text-muted-foreground">
              {allSubmissions.length} submission
              {allSubmissions.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <Link
          className={buttonVariants({ variant: "link" })}
          href={`/talent/challenges/${_challenge}/builds/submit`}
        >
          Add Submission
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {allSubmissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="relative mb-4">
            <div className="bg-muted/30 p-4 rounded-full">
              <Trophy className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
          <p className="text-muted-foreground mb-4 text-sm max-w-sm">
            Be the first to submit your project to this challenge
          </p>
          <Link
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-medium"
            href={`/talent/challenges/${_challenge}/builds/submit`}
          >
            Submit Build
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allSubmissions.map((submission) => {
            const timeAgo = formatDistanceToNow(
              new Date(submission.created_at),
              {
                addSuffix: true,
              }
            );

            return (
              <div
                key={submission.id}
                className="bg-card border rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  {/* Square Project Icon */}
                  <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={submission.images.url}
                      alt={submission.images.alt}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm leading-tight truncate pr-2">
                        {submission.title}
                      </h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {/* Status Icon */}
                        <div
                          className="p-1 rounded"
                          title={
                            submission.status === "VISIBLE"
                              ? "Public"
                              : "Hidden"
                          }
                        >
                          {submission.status === "VISIBLE" ? (
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </div>

                        {/* Demo Link */}
                        <Link
                          href={submission.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded hover:bg-muted"
                          title="View Demo"
                        >
                          <Play className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                        </Link>

                        {/* GitHub Link */}
                        <Link
                          href={submission.repository_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded hover:bg-muted"
                          title="View Code"
                        >
                          <Github className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                        </Link>
                      </div>
                    </div>

                    {submission.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                        {submission.description}
                      </p>
                    )}

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {timeAgo}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
