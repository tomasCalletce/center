import { publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import {
  challenges,
  challengeVisibilityValues,
} from "~/server/db/schemas/challenges";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { assets } from "~/server/db/schemas/asset";
import { assetsImages } from "~/server/db/schemas/assets-images";

export const all = publicProcedure
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
        slug: challenges.slug,
        deadline_at: challenges.deadline_at,
        price_pool: challenges.price_pool,
        price_pool_currency: challenges.price_pool_currency,
        image: {
          pathname: assets.pathname,
          url: assets.url,
          alt: assetsImages.alt,
        },
      })
      .from(challenges)
      .innerJoin(assetsImages, eq(challenges._image, assetsImages.id))
      .innerJoin(assets, eq(assetsImages._asset, assets.id))
      .where(eq(challenges.visibility, challengeVisibilityValues.VISIBLE))
      .limit(input.limit)
      .offset(input.offset)
      .orderBy(asc(challenges.deadline_at));

    return allChallenges;
  });
