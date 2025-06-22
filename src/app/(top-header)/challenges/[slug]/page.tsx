import { HydrateClient } from "~/trpc/server";
import { ChallengeDetails } from "~/app/(top-header)/challenges/[slug]/_components/challenge-details";
import { ChallengeParticipants } from "~/app/(top-header)/challenges/[slug]/_components/challenge-participants";
import { ChallengeMarkdown } from "~/app/(top-header)/challenges/[slug]/_components/challenge-markdown";
import { SignedIn } from "@clerk/nextjs";

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
          <SignedIn>
            <ChallengeParticipants slug={slug} />
          </SignedIn>
          <ChallengeMarkdown slug={slug} />
        </div>
      </div>
    </HydrateClient>
  );
}
