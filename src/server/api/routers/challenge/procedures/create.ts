import { isAdminAuthedProcedure } from "~/server/api/trpc";
import { assets } from "~/server/db/schemas/asset";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db/connection";
import {
  challenges,
  verifyChallengesSchema,
} from "~/server/db/schemas/challenges";
import { assetsImages } from "~/server/db/schemas/assets-images";

export const create = isAdminAuthedProcedure
  .input(verifyChallengesSchema)
  .mutation(async ({ input, ctx }) => {
    const [newDocument] = await db
      .insert(assets)
      .values({
        _clerk: ctx.auth.userId,
        pathname: input.verifyAssetsImageSchema.verifyAssetsSchema.pathname,
        url: input.verifyAssetsImageSchema.verifyAssetsSchema.url,
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
        alt: input.verifyAssetsImageSchema.alt,
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
        title: input.title,
        slug: input.slug,
        description: input.description,
        markdown: input.markdown,
        visibility: input.visibility,
        price_pool: input.price_pool,
        price_pool_currency: input.price_pool_currency,
        open_at: input.open_at,
        deadline_at: input.deadline_at,
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
