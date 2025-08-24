import { protectedProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schemas/users";
import { eq } from "drizzle-orm";
import { db } from "~/server/db/connection";
import { clerkClient } from "~/server/api/auth";

export const syncClerkData = protectedProcedure.mutation(async ({ ctx }) => {
  const clerkUser = await clerkClient.users.getUser(ctx.auth.userId);
  
  const displayName = 
    clerkUser.firstName && clerkUser.lastName 
      ? `${clerkUser.firstName} ${clerkUser.lastName}`
      : clerkUser.firstName || clerkUser.lastName || null;

  const [updatedUser] = await db
    .insert(users)
    .values({
      _clerk: ctx.auth.userId,
      display_name: displayName,
      experience: [],
      education: [],
      skills: [],
      social_links: [],
    })
    .onConflictDoUpdate({
      target: users._clerk,
      set: {
        display_name: displayName,
        updated_at: new Date(),
      },
    })
    .returning();

  if (!updatedUser) {
    throw new Error("Failed to sync user data");
  }

  return updatedUser;
});
