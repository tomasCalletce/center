import { protectedProcedure } from "~/server/api/trpc";
import { type User, users } from "~/server/db/schemas/users";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db/connection";

export const getProfile = protectedProcedure.query(async ({ ctx }) => {
  const [userProfile] = await db
    .select({
      id: users.id,
      display_name: users.display_name,
      location: users.location,
      current_title: users.current_title,
      social_links: users.social_links,
      experience: users.experience,
      education: users.education,
      skills: users.skills,
    })
    .from(users)
    .where(eq(users._clerk, ctx.auth.userId));

  if (!userProfile) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User profile not found",
    });
  }

  return userProfile as User;
});
