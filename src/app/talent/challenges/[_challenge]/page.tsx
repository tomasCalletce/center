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

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ _challenge: string }>;
}) {
  const { _challenge } = await params;

  const challenge = await api.challenge.details({ _challenge });
  return (
    <HydrateClient>
      <Navigation>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/talent">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/talent/challenges">
                Challenges
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{challenge.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Navigation>
      <div className="w-full px-6 py-6 space-y-6">
        <ChallengeDetails _challenge={_challenge} />
        <ChallengeParticipants _challenge={_challenge} />
      </div>
    </HydrateClient>
  );
}
