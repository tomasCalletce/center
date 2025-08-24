import { protectedProcedure } from "~/server/api/trpc";
import { users, verifyUserProfileSchema } from "~/server/db/schemas/users";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db/connection";
import { clerkClient } from "~/server/api/auth";

export const updateProfile = protectedProcedure
  .input(verifyUserProfileSchema)
  .mutation(async ({ input, ctx }) => {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users._clerk, ctx.auth.userId))
      .limit(1);

    if (!existingUser) {
      const clerkUser = await clerkClient.users.getUser(ctx.auth.userId);
      
      const displayName = 
        clerkUser.firstName && clerkUser.lastName 
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser.firstName || clerkUser.lastName || null;

      const [newUser] = await db
        .insert(users)
        .values({
          _clerk: ctx.auth.userId,
          display_name: displayName,
          skills: input.skills || [],
          current_title: input.current_title,
          location: input.location,
          experience: input.experience || [],
          education: input.education || [],
          social_links: input.social_links || [],
        })
        .returning();

      if (!newUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user profile",
        });
      }

      return newUser;
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        skills: input.skills,
        current_title: input.current_title,
        location: input.location,
        experience: input.experience,
        education: input.education,
        updated_at: new Date(),
      })
      .where(eq(users._clerk, ctx.auth.userId))
      .returning();

    if (!updatedUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User profile not found",
      });
    }

    return updatedUser;
  });
