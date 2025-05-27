import { HydrateClient } from "~/trpc/server";

export default async function Admin() {
  return (
    <HydrateClient>
      <div className="w-full px-6 py-4">admin que mas</div>
    </HydrateClient>
  );
}
