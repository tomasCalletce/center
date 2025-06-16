import { protectedProcedure } from "~/server/api/trpc";
import { assets } from "~/server/db/schemas/asset";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db/connection";
import {
  challenges,
  challengeVisibilityValues,
  verifyChallengesSchema,
} from "~/server/db/schemas/challenges";
import { assetsImages } from "~/server/db/schemas/assets-images";

const createChallengeSchema = verifyChallengesSchema.omit({
  _image: true,
});

export const create = protectedProcedure
  .input(createChallengeSchema)
  .mutation(async ({ input, ctx }) => {
  const [newDocument] = await db
    .insert(assets)
    .values({
      _clerk: ctx.auth.userId,
      pathname:
        "WhatsApp%20Image%202025-05-01%20at%2014.22.35-aVQ6qXrhhThJFUhfW4dBP0Ku5ar2S5.jpeg",
      url: "https://ow7zxw0pjoyp0q71.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-01%20at%2014.22.35-aVQ6qXrhhThJFUhfW4dBP0Ku5ar2S5.jpeg",
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
      alt: input.title,
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
      markdown: input.markdown,
      visibility: input.visibility,
      price_pool: input.price_pool,
      price_pool_currency: input.price_pool_currency,
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
