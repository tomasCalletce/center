import { protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import {
  challenges,
  updateChallengeSchema,
} from "~/server/db/schemas/challenges";
import { assets } from "~/server/db/schemas/asset";
import { assetsImages } from "~/server/db/schemas/assets-images";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const update = protectedProcedure
  .input(updateChallengeSchema)
  .mutation(async ({ input, ctx }) => {
    const { id, imageData, ...updateData } = input;

    // Check if the challenge exists and belongs to the user
    const [existingChallenge] = await db
      .select({ id: challenges.id, _clerk: challenges._clerk, _image: challenges._image })
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

    // Handle image update if provided
    if (imageData) {
      // Get the existing image asset ID
      const [existingImage] = await db
        .select({ _asset: assetsImages._asset })
        .from(assetsImages)
        .where(eq(assetsImages.id, existingChallenge._image));

      if (existingImage && existingImage._asset) {
        // Update the existing asset
        await db
          .update(assets)
          .set({
            pathname: imageData.pathname,
            url: imageData.url,
          })
          .where(eq(assets.id, existingImage._asset));

        // Update the image alt text
        await db
          .update(assetsImages)
          .set({
            alt: imageData.alt,
          })
          .where(eq(assetsImages.id, existingChallenge._image));
      }
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