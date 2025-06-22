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
import { MDXRenderer } from "~/components/mdx-renderer";
import { Separator } from "~/components/ui/separator";

interface ChallengeMarkdownProps {
  slug: string;
}

export const ChallengeMarkdown: React.FC<ChallengeMarkdownProps> = async ({
  slug,
}) => {
  const challenge = await api.public.challenge.details({
    challenge_slug: slug,
  });

  return (
    <div className="w-full max-w-none space-y-4">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4" />
          Challenge Details
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          {challenge.title}
        </h1>
      </div>
      <Separator />
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full" />
        <div className="pl-6">
          <MDXRenderer content={challenge.markdown} />
        </div>
      </div>
    </div>
  );
};
