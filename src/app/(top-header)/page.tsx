import { HydrateClient } from "~/trpc/server";
import { AiHackathon } from "~/app/(top-header)/_components/ia-hackathon";
import { Companies } from "~/app/(top-header)/_components/compnies";
import { TopHero } from "~/app/(top-header)/_components/top-hero";
import { HowItWorks } from "~/app/(top-header)/_components/how-it-works";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="space-y-16">
        <TopHero />
        <AiHackathon />
        <HowItWorks />
        <Companies />
      </div>
    </HydrateClient>
  );
}
