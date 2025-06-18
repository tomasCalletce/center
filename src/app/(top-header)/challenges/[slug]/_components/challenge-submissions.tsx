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
  Globe,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { buttonVariants } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

interface ChallengeSubmissionsProps {
  challenge: string;
}

export const ChallengeSubmissions: React.FC<
  ChallengeSubmissionsProps
> = async ({ challenge }) => {
  const allSubmissions = await api.public.challenge.allSubmissions({ _challenge: challenge });

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
          href={`/challenges/${challenge}/submissions/submit`}
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
            href={`/challenges/${challenge}/submissions/submit`}
          >
            Submit Build
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allSubmissions.map((submission) => {
            const timeAgo = formatDistanceToNow(
              new Date(submission.created_at),
              {
                addSuffix: true,
              }
            );

            return (
              <Link
                key={submission.id}
                href={`/submissions/${submission.id}`}
                className="group bg-card border rounded-xl overflow-hidden shadow-sm"
              >
                {/* Main Content */}
                <div className="p-4">
                  <div className="flex items-start gap-5">
                    {/* Project Image with enhanced styling */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 flex-shrink-0 ring-1 ring-border/50 group-hover:ring-primary/30 transition-all duration-300">
                      <Image
                        src={submission.images.url}
                        alt={submission.images.alt}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title with inline icons */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-bold text-xl text-foreground leading-tight group-hover:text-primary transition-colors duration-200">
                            {submission.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            by {submission.team.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                          <Link
                            href={submission.repository_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-muted/80 transition-colors"
                            title="View Code"
                          >
                            <Github className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </Link>
                          <Link
                            href={submission.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-muted/80 transition-colors"
                            title="Visit Website"
                          >
                            <Globe className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </Link>
                          <Link
                            href={submission.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                            title="View Demo"
                          >
                            <Play className="h-4 w-4 fill-current" />
                          </Link>
                        </div>
                      </div>

                      {/* Description */}
                      {submission.description && (
                        <p className="text-muted-foreground line-clamp-3 leading-relaxed mb-4 text-sm group-hover:text-muted-foreground/80 transition-colors">
                          {submission.description}
                        </p>
                      )}

                      {/* Status and Time with better styling */}
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                          <div className="p-1 bg-muted/50 rounded-md">
                            <Clock className="h-3 w-3" />
                          </div>
                          <span className="font-medium">{timeAgo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {submission.status === "VISIBLE" ? (
                              <>
                                <Eye className="h-3 w-3" />
                                <span>Live</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3" />
                                <span>Draft</span>
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
