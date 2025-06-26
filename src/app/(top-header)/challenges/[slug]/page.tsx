import { HydrateClient } from "~/trpc/server";
import { ChallengeDetails } from "~/app/(top-header)/challenges/[slug]/_components/challenge-details";
import { ChallengeMarkdown } from "~/app/(top-header)/challenges/[slug]/_components/challenge-markdown";

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <HydrateClient>
      <div className="w-full px-6 py-6">
        <div className="space-y-6">
          <ChallengeDetails slug={slug} />
          <ChallengeMarkdown slug={slug} />
        </div>
      </div>
    </HydrateClient>
  );
}
