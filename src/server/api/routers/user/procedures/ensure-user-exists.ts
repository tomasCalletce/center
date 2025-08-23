import { protectedProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schemas/users";
import { eq } from "drizzle-orm";
import { db } from "~/server/db/connection";
import { clerkClient } from "~/server/api/auth";

export const ensureUserExists = protectedProcedure.mutation(async ({ ctx }) => {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users._clerk, ctx.auth.userId))
    .limit(1);

  if (existingUser) {
    return existingUser;
  }

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
    .returning();

  if (!newUser) {
    throw new Error("Failed to create user record");
  }

  return newUser;
});
