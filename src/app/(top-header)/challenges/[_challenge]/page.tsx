import { HydrateClient } from "~/trpc/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { ChallengeDetails } from "./_components/challenge-details";
import { ChallengeParticipants } from "./_components/challenge-participants";
import { api } from "~/trpc/server";
import { Navigation } from "~/components/ui/navigation";
import { ChallengeSubmissions } from "~/app/(top-header)/challenges/[_challenge]/_components/challenge-submissions";
import { Separator } from "~/components/ui/separator";

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ _challenge: string }>;
}) {
  const { _challenge } = await params;

  const challenge = await api.challenge.details({ _challenge });
  return (
    <HydrateClient>
      <div className="w-full px-6 py-6">
        <div className="space-y-6 mb-4">
          <ChallengeDetails _challenge={_challenge} />
          <ChallengeParticipants _challenge={_challenge} />
        </div>
        <Separator />
        <div className="space-y-6 mt-4">
          <ChallengeSubmissions _challenge={_challenge} />
        </div>
      </div>
    </HydrateClient>
  );
}
