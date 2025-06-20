import { HydrateClient } from "~/trpc/server";
import { ChallengeDetails } from "~/app/(top-header)/challenges/[slug]/_components/challenge-details";
import { ChallengeParticipants } from "~/app/(top-header)/challenges/[slug]/_components/challenge-participants";
// import { ChallengeSubmissions } from "~/app/(top-header)/challenges/[_challenge]/_components/challenge-submissions";
import { Separator } from "~/components/ui/separator";

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <HydrateClient>
      <div className="w-full px-6 py-6">
        <div className="space-y-6 mb-4">
          <ChallengeDetails slug={slug} />
          <ChallengeParticipants slug={slug} />
        </div>
        <div className="space-y-6 mt-4">
          {/* <ChallengeSubmissions challenge={slug} /> */}
        </div>
      </div>
    </HydrateClient>
  );
}
