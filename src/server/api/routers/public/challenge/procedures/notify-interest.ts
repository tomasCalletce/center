import { publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { participationIntents } from "~/server/db/schemas/participation-intents";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const notifyInterest = publicProcedure
  .input(z.object({ challengeId: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    if (!ctx.auth?.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Must be logged in to express interest",
      });
    }

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
      .returning({ id: participationIntents.id });

    if (!newIntent) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to record interest",
      });
    }

    return { success: true, message: "Interest recorded successfully" };
  }); 