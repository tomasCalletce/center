import { protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { submissions } from "~/server/db/schemas/submissions";
import { clerkClient } from "~/server/api/auth";

export const participant = protectedProcedure
  .input(
    z.object({
      _challenge: z.string().uuid(),
    })
  )
  .query(async ({ input }) => {
    const allChallenges = await db
      .select({
        id: submissions.id,
        _clerk: submissions._clerk,
      })
      .from(submissions)
      .where(eq(submissions._challenge, input._challenge))
      .limit(6);

    const userList = await clerkClient.users.getUserList({
      userId: allChallenges.map((challenge) => challenge._clerk),
    });

    return userList;
  });
