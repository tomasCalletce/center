import { protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import {
  challenges,
  verifyChallengesSchema,
} from "~/server/db/schemas/challenges";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const updateChallengeSchema = verifyChallengesSchema.omit({
  _image: true,
}).extend({
  id: z.string(),
});

export const update = protectedProcedure
  .input(updateChallengeSchema)
  .mutation(async ({ input, ctx }) => {
    const { id, ...updateData } = input;

    // Check if the challenge exists and belongs to the user
    const [existingChallenge] = await db
      .select({ id: challenges.id, _clerk: challenges._clerk })
      .from(challenges)
      .where(eq(challenges.id, id));

    if (!existingChallenge) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Challenge not found",
      });
    }

    if (existingChallenge._clerk !== ctx.auth.userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You can only update your own challenges",
      });
    }

    const [updatedChallenge] = await db
      .update(challenges)
      .set(updateData)
      .where(eq(challenges.id, id))
      .returning({ id: challenges.id });

    if (!updatedChallenge) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update challenge",
      });
    }

    return updatedChallenge;
  }); 