import Image from "next/image";
import { api } from "~/trpc/server";

export const RecentChallenges = async () => {
  const recentChallenges = await api.challenge.all({ limit: 10, offset: 0 });

  return (
    <div>
      {recentChallenges.map((challenge) => (
        <div key={challenge.id}>
          <Image
            src={challenge.asset.pathname}
            alt={challenge.title}
            width={100}
            height={100}
          />
        </div>
      ))}
    </div>
  );
};
