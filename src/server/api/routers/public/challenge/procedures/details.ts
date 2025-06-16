import { publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { challenges } from "~/server/db/schemas/challenges";
import { z } from "zod";
import { eq, or } from "drizzle-orm";
import { assetsImages } from "~/server/db/schemas/assets-images";
import { assets } from "~/server/db/schemas/asset";
import { TRPCError } from "@trpc/server";
import { titleToSlug } from "~/lib/utils";

export const details = publicProcedure
  .input(
    z.object({
      _challenge: z.string(),
    })
  )
  .query(async ({ input }) => {
    // Check if input is a UUID (36 chars with hyphens) or a slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input._challenge);
    
    let whereCondition;
    if (isUUID) {
      whereCondition = eq(challenges.id, input._challenge);
    } else {
      // For slug, we need to get all challenges and find the one with matching slug
      const allChallenges = await db
        .select({
          id: challenges.id,
          title: challenges.title,
        })
        .from(challenges);
      
      const matchingChallenge = allChallenges.find(
        (challenge) => titleToSlug(challenge.title) === input._challenge
      );
      
      if (!matchingChallenge) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Challenge not found",
        });
      }
      
      whereCondition = eq(challenges.id, matchingChallenge.id);
    }

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
      .where(whereCondition);
      
    if (!challenge) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Challenge not found",
      });
    }

    return challenge;
  });
