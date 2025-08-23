import { protectedProcedure } from "~/server/api/trpc";
import { type User, users } from "~/server/db/schemas/users";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db/connection";
import { clerkClient } from "~/server/api/auth";

export const getProfile = protectedProcedure.query(async ({ ctx }) => {
  let [userProfile] = await db
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
        experience: [],
        education: [],
        skills: [],
        social_links: [],
      })
      .returning({
        id: users.id,
        display_name: users.display_name,
        location: users.location,
        current_title: users.current_title,
        social_links: users.social_links,
        experience: users.experience,
        education: users.education,
        skills: users.skills,
      });

    if (!newUser) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create user profile",
      });
    }

    userProfile = newUser;
  }

  return userProfile as User;
});
