import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { dbSocket } from "~/server/db/connection";
import { teams } from "~/server/db/schemas/teams";
import { teamMembers } from "~/server/db/schemas/team-members";
import { submissions } from "~/server/db/schemas/submissions";
import { eq, and } from "drizzle-orm";

export const getUserTeams = protectedProcedure
  .input(
    z.object({
      challengeId: z.string().uuid(),
    })
  )
  .query(async ({ input, ctx }) => {
    const userTeams = await dbSocket
      .select({
        id: teams.id,
        name: teams.name,
        max_members: teams.max_members,
        created_at: teams.created_at,
        memberCount: eq(teamMembers._clerk, ctx.auth.userId),
        hasSubmission: submissions.id,
      })
      .from(teams)
      .innerJoin(teamMembers, eq(teams.id, teamMembers._team))
      .leftJoin(
        submissions,
        and(
          eq(submissions._team, teams.id),
          eq(submissions._challenge, input.challengeId)
        )
      )
      .where(eq(teamMembers._clerk, ctx.auth.userId));

    return userTeams.map((team) => ({
      ...team,
      hasSubmission: !!team.hasSubmission,
    }));
  }); 