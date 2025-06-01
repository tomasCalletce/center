import { protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { challenges } from "~/server/db/schemas/challenges";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { images } from "~/server/db/schemas/images";
import { assets } from "~/server/db/schemas/asset";
import { TRPCError } from "@trpc/server";

export const details = protectedProcedure
  .input(
    z.object({
      _challenge: z.string().uuid(),
    })
  )
  .query(async ({ input }) => {
    const [challenge] = await db
      .select({
        id: challenges.id,
        title: challenges.title,
        deadline_at: challenges.deadline_at,
        price_pool: challenges.price_pool,
        price_pool_currency: challenges.price_pool_currency,
        image: {
          pathname: assets.pathname,
          url: assets.url,
          alt: images.alt,
        },
      })
      .from(challenges)
      .innerJoin(images, eq(challenges._image, images.id))
      .innerJoin(assets, eq(images._asset, assets.id))
      .where(eq(challenges.id, input._challenge));
    if (!challenge) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Challenge not found",
      });
    }

    return challenge;
  });
