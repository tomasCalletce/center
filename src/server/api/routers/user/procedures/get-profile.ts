import { protectedProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schemas/users";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db/connection";

export const getProfile = protectedProcedure
  .query(async ({ ctx }) => {
    const [userProfile] = await db
      .select()
      .from(users)
      .where(eq(users._user, ctx.auth.userId));

    if (!userProfile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User profile not found",
      });
    }

    return userProfile;
  });