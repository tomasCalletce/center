import { protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { submissions } from "~/server/db/schemas/submissions";
import { teams } from "~/server/db/schemas/teams";
import { teamMembers } from "~/server/db/schemas/team-members";
import { z } from "zod";
import { eq, and } from "drizzle-orm";

export const getUserSubmission = protectedProcedure
  .input(z.object({ challengeId: z.string().uuid() }))
  .query(async ({ input, ctx }) => {
    const userSubmission = await db
      .select({
        id: submissions.id,
        title: submissions.title,
        created_at: submissions.created_at,
      })
      .from(submissions)
      .innerJoin(teams, eq(submissions._team, teams.id))
      .innerJoin(teamMembers, eq(teams.id, teamMembers._team))
      .where(
        and(
          eq(submissions._challenge, input.challengeId),
          eq(teamMembers._clerk, ctx.auth.userId)
        )
      )
      .limit(1);

    return userSubmission.at(0);
  }); 