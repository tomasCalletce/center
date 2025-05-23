import Link from "next/link";

import { HydrateClient, api } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main>
        que mas
      </main>
    </HydrateClient>
  );
}
