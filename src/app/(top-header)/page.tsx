import { HydrateClient } from "~/trpc/server";
import { AiHackathon } from "~/app/(top-header)/_components/ia-hackathon";
import { Companies } from "~/app/(top-header)/_components/compnies";
import { CommunityShowcase } from "~/app/(top-header)/_components/community-showcase";
import { HowItWorks } from "~/app/(top-header)/_components/how-it-works";
import { Challenges } from "~/app/(top-header)/_components/challenges";
import { Partners } from "~/app/(top-header)/_components/parnerts";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="md:space-y-8">
        <Challenges />
        <Partners />
        <CommunityShowcase />
        <HowItWorks />
        <AiHackathon />
        <Companies />
      </div>
    </HydrateClient>
  );
}
