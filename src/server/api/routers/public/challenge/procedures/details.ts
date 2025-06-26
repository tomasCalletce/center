import { publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { challenges } from "~/server/db/schemas/challenges";
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { assetsImages } from "~/server/db/schemas/assets-images";
import { assets } from "~/server/db/schemas/asset";
import { TRPCError } from "@trpc/server";
import { participationIntents } from "~/server/db/schemas/participation-intents";

export const details = publicProcedure
  .input(
    z
      .object({
        _challenge: z.string().uuid().optional(),
        challenge_slug: z.string().optional(),
      })
      .refine((data) => data._challenge || data.challenge_slug, {
        message: "Either challenge ID or slug must be provided",
      })
  )
  .query(async ({ input, ctx }) => {
    const whereCondition = input._challenge
      ? eq(challenges.id, input._challenge)
      : eq(challenges.slug, input.challenge_slug!);

    const [challenge] = await db
      .select({
        id: challenges.id,
        title: challenges.title,
        slug: challenges.slug,
        description: challenges.description,
        markdown: challenges.markdown,
        deadline_at: challenges.deadline_at,
        open_at: challenges.open_at,
        price_pool: challenges.price_pool,
        price_pool_currency: challenges.price_pool_currency,
        is_notified: ctx.auth.userId
          ? sql<boolean>`EXISTS (
              SELECT 1 FROM ${participationIntents} 
              WHERE ${participationIntents._challenge} = ${challenges.id} 
              AND ${participationIntents._clerk} = ${ctx.auth.userId}
            )`
          : sql<boolean>`false`,
        image: {
          pathname: assets.pathname,
          url: assets.url,
          alt: assetsImages.alt,
        },
      })
      .from(challenges)
      .innerJoin(assetsImages, eq(challenges._image, assetsImages.id))
      .innerJoin(assets, eq(assetsImages._asset, assets.id))
      .where(whereCondition);

    if (!challenge) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Challenge not found",
      });
    }

    return challenge;
  });
