import { HydrateClient } from "~/trpc/server";
import { CreateChallenge } from "~/app/admin/_components/create-challenge";

export default async function Admin() {
  return (
    <HydrateClient>
      <div className="w-full px-6 py-4">
        <CreateChallenge />
      </div>
    </HydrateClient>
  );
}
