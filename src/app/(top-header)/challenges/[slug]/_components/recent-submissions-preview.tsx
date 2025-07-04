"use client";

import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Clock, Users, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface RecentSubmissionsPreviewProps {
  slug: string;
}

export const RecentSubmissionsPreview: React.FC<RecentSubmissionsPreviewProps> = ({ slug }) => {
  const recentSubmissionsQuery = api.public.challenge.recentSubmissions.useQuery({
    challenge_slug: slug,
    limit: 5,
  });

  if (recentSubmissionsQuery.isLoading) {
    return (
      <div className="w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <FileText className="h-6 w-6" />
            Latest Builds
          </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 px-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-56 p-4 rounded-xl border bg-white shadow-sm">
              <div className="h-24 w-full bg-muted rounded-lg mb-3 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!recentSubmissionsQuery.data || recentSubmissionsQuery.data.length === 0) {
    return (
      <div className="w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <FileText className="h-6 w-6" />
            Latest Builds
          </h2>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No builds yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <FileText className="h-6 w-6" />
          Latest Builds
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 px-4">
        {recentSubmissionsQuery.data.map((submission) => (
          <div key={submission.id} className="flex-shrink-0 w-56 p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="relative w-full h-24 mb-3 rounded-lg overflow-hidden bg-muted">
              {submission.logo_image?.url ? (
                <Image
                  src={submission.logo_image.url}
                  alt={submission.logo_image.alt || submission.title}
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
              <div className="font-medium text-sm truncate">{submission.title}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span className="truncate">{submission.team?.name || 'Unknown Team'}</span>
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {submission.submitted_by?.display_name || 'Unknown User'}
              </div>
              <Badge variant="outline" className="text-xs w-fit">
                <Clock className="h-3 w-3 mr-1" />
                {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 