import { protectedProcedure } from "~/server/api/trpc";
import { assets } from "~/server/db/schemas/asset";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db/connection";
import { challenges } from "~/server/db/schemas/challenges";

export const createCV = protectedProcedure.mutation(async ({ input, ctx }) => {
  const [newDocument] = await db
    .insert(assets)
    .values({
      _clerk: ctx.auth.userId,
      pathname:
        "WhatsApp%20Image%202025-05-01%20at%2014.22.35-aVQ6qXrhhThJFUhfW4dBP0Ku5ar2S5.jpeg",
      content_type: "image/jpeg",
    })
    .returning({ id: assets.id });
  if (!newDocument) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create asset in database.",
    });
  }
  const [newChallenge] = await db
    .insert(challenges)
    .values({
      _clerk: ctx.auth.userId,
      _asset: newDocument.id,
      title: "titutlo",
      markdown: "super challenge",
      visibility: "VISIBLE",
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
