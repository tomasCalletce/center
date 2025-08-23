import { HydrateClient } from "~/trpc/server";
import { ChallengeDetails } from "~/app/(top-header)/challenges/[slug]/_components/challenge-details";
import { ChallengeTabs } from "~/app/(top-header)/challenges/[slug]/_components/challenge-tabs";

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <HydrateClient>
      <div className="w-full py-6">
        <div className="space-y-6">
          <ChallengeDetails slug={slug} />
          <ChallengeTabs slug={slug} />
        </div>
      </div>
    </HydrateClient>
  );
}
