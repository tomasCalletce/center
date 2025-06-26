import { protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { participationIntents } from "~/server/db/schemas/participation-intents";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { resend } from "~/server/email/config";
import { clerkClient } from "~/server/api/auth";

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

    try {
      const client = await clerkClient;
      const clerkUser = await client.users.getUser(ctx.auth.userId);
      
      const userEmail = clerkUser.emailAddresses.find(
        email => email.id === clerkUser.primaryEmailAddressId
      )?.emailAddress;

      if (!userEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No email address found",
        });
      }

      await resend.contacts.create({
        email: userEmail,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        unsubscribed: false,
        audienceId: "270fd227-4f7a-49d0-962f-c848df8cbafe",
      });

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
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to add to notification list",
      });
    }
  }); 