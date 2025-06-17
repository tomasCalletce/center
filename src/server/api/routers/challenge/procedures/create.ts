import { protectedProcedure } from "~/server/api/trpc";
import { assets } from "~/server/db/schemas/asset";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db/connection";
import {
  challenges,
  challengeVisibilityValues,
  createChallengeSchema,
} from "~/server/db/schemas/challenges";
import { assetsImages } from "~/server/db/schemas/assets-images";

export const create = protectedProcedure
  .input(createChallengeSchema)
  .mutation(async ({ input, ctx }) => {
    const { imageData, ...challengeData } = input;
    
    const [newDocument] = await db
      .insert(assets)
      .values({
        _clerk: ctx.auth.userId,
        pathname: imageData.pathname,
        url: imageData.url,
      })
      .returning({ id: assets.id });
  if (!newDocument) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create asset in database.",
    });
  }

  const [newImage] = await db
    .insert(assetsImages)
    .values({
      _clerk: ctx.auth.userId,
      _asset: newDocument.id,
      alt: imageData.alt,
    })
    .returning({ id: assetsImages.id });
  if (!newImage) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create image in database.",
    });
  }

  const [newChallenge] = await db
    .insert(challenges)
    .values({
      _clerk: ctx.auth.userId,
      _image: newImage.id,
      title: challengeData.title,
      markdown: challengeData.markdown,
      visibility: challengeData.visibility,
      price_pool: challengeData.price_pool,
      price_pool_currency: challengeData.price_pool_currency,
      deadline_at: challengeData.deadline_at,
    })
    .returning({ id: challenges.id });
  if (!newChallenge) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create challenges in database.",
    });
  }

  return newChallenge;
});
