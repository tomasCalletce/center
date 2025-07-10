import { protectedProcedure } from "~/server/api/trpc";
import { users, verifyUserProfileSchema } from "~/server/db/schemas/users";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db/connection";

export const updateProfile = protectedProcedure
  .input(verifyUserProfileSchema)
  .mutation(async ({ input, ctx }) => {
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
