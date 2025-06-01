import { HydrateClient } from "~/trpc/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Navigation } from "~/components/ui/navigation";
import { ChallengeDetails } from "./_components/challenge-details";
import { ChallengeParticipants } from "./_components/challenge-participants";

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ _challenge: string }>;
}) {
  return (
    <HydrateClient>
      <Navigation>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Navigation>
      <div className="w-full px-6 py-6 space-y-6">
        <ChallengeDetails params={params} />
        <ChallengeParticipants params={params} />
      </div>
    </HydrateClient>
  );
}
