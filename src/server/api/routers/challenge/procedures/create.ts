import { protectedProcedure } from "~/server/api/trpc";
import { assets } from "~/server/db/schemas/asset";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db/connection";
import {
  challenges,
  challengeVisibilityValues,
} from "~/server/db/schemas/challenges";
import { images } from "~/server/db/schemas/images";

export const create = protectedProcedure.mutation(async ({ input, ctx }) => {
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
    .insert(images)
    .values({
      _clerk: ctx.auth.userId,
      _asset: newDocument.id,
      alt: "super challenge",
    })
    .returning({ id: images.id });
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
      title: "titutlo",
      markdown: "super challenge",
      visibility: challengeVisibilityValues.VISIBLE,
      price_pool: 100,
      price_pool_currency: "USD",
      deadline_at: new Date(),
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
