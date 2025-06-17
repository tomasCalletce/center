import { HydrateClient } from "~/trpc/server";
import { ChallengeDetails } from "./_components/challenge-details";
import { ChallengeParticipants } from "./_components/challenge-participants";
import { ChallengeSubmissions } from "./_components/challenge-submissions";
import { Separator } from "~/components/ui/separator";

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ challenge: string }>;
}) {
  const { challenge } = await params;

  return (
    <HydrateClient>
      <div className="w-full px-6 py-6">
        <div className="space-y-6 mb-4">
          <ChallengeDetails challenge={challenge} />
          <ChallengeParticipants challenge={challenge} />
        </div>
        <Separator />
        <div className="space-y-6 mt-4">
          <ChallengeSubmissions challenge={challenge} />
        </div>
      </div>
    </HydrateClient>
  );
}
