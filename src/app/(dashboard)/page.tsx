import { HydrateClient } from "~/trpc/server";

export default function Dashboard() {
  return (
    <HydrateClient>
      <div>Dashboard</div>
    </HydrateClient>
  );
}
