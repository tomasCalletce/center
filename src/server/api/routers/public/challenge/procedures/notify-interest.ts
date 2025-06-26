import { protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { participationIntents } from "~/server/db/schemas/participation-intents";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const notifyInterest = protectedProcedure
  .input(z.object({ challengeId: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {

    const existingIntent = await db
      .select()
      .from(participationIntents)
      .where(
        and(
          eq(participationIntents._clerk, ctx.auth.userId),
          eq(participationIntents._challenge, input.challengeId)
        )
      )
      .limit(1);

    if (existingIntent.length > 0) {
      return { success: true, message: "Interest already recorded" };
    }

    const [newIntent] = await db
      .insert(participationIntents)
      .values({
        _clerk: ctx.auth.userId,
        _challenge: input.challengeId,
      })
      .returning();

    if (!newIntent) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to record interest",
      });
    }

    return newIntent;
  }); 