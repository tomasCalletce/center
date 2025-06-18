import { publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { challenges } from "~/server/db/schemas/challenges";
import { z } from "zod";
import { eq, or } from "drizzle-orm";
import { assetsImages } from "~/server/db/schemas/assets-images";
import { assets } from "~/server/db/schemas/asset";
import { TRPCError } from "@trpc/server";

export const detailsBySlug = publicProcedure
  .input(
    z.object({
      challenge_slug: z.string(),
    })
  )
  .query(async ({ input }) => {
    const [challenge] = await db
      .select({
        id: challenges.id,
        title: challenges.title,
        markdown: challenges.markdown,
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
      .where(eq(challenges.slug, input.challenge_slug));
    if (!challenge) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Challenge not found",
      });
    }

    return challenge;
  });
