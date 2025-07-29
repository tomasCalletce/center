"use client";

import Image from "next/image";
import { api } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import { Clock, Users, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useIsMobile } from "~/hooks/use-mobile";

interface RecentSubmissionsPreviewProps {
  slug: string;
}

export const RecentSubmissionsPreview: React.FC<
  RecentSubmissionsPreviewProps
> = ({ slug }) => {
  const isMobile = useIsMobile();
  const recentSubmissionsQuery =
    api.public.challenge.recentSubmissions.useQuery({
      challenge_slug: slug,
      limit: 5,
    });

  if (isMobile) return null;

  if (!recentSubmissionsQuery.data || recentSubmissionsQuery.data.length < 5)
    return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 flex gap-2">
        <FileText className="h-6 w-6" />
        Latest Builds
      </h2>
      <div className="flex gap-4 overflow-x-auto">
        {recentSubmissionsQuery.data.map((submission) => (
          <div
            key={submission.id}
            className="flex-shrink-0 w-56 p-2 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative w-full h-24 mb-3 rounded-lg overflow-hidden bg-muted">
              {submission.logo_image?.url ? (
                <Image
                  src={submission.logo_image.url}
                  alt={submission.logo_image.alt ?? "Submission Logo"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-primary/10">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="font-medium text-sm truncate">
                {submission.title}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span className="truncate">
                  {submission.team?.name || "Unknown Team"}
                </span>
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {submission.submitted_by?.display_name || "Unknown User"}
              </div>
              <Badge variant="outline" className="text-xs w-fit">
                <Clock className="h-3 w-3 mr-1" />
                {formatDistanceToNow(
                  toZonedTime(
                    new Date(submission.created_at),
                    Intl.DateTimeFormat().resolvedOptions().timeZone
                  ),
                  { addSuffix: true }
                )}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
