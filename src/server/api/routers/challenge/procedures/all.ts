import { protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import {
  challenges,
  challengeVisibilityValues,
} from "~/server/db/schemas/challenges";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { assets } from "~/server/db/schemas/asset";

export const all = protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).default(10),
      offset: z.number().min(0).default(0),
    })
  )
  .query(async ({ input }) => {
    const allChallenges = await db
      .select({
        id: challenges.id,
        title: challenges.title,
        deadline_at: challenges.deadline_at,
        asset: {
          pathname: assets.pathname,
        },
      })
      .from(challenges)
      .innerJoin(assets, eq(challenges._asset, assets.id))
      .where(eq(challenges.visibility, challengeVisibilityValues.VISIBLE))
      .limit(input.limit)
      .offset(input.offset)
      .orderBy(asc(challenges.deadline_at));

    return allChallenges;
  });
