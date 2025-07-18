import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { dbSocket } from "~/server/db/connection";
import { teams } from "~/server/db/schemas/teams";
import { teamMembers } from "~/server/db/schemas/team-members";
import { submissions } from "~/server/db/schemas/submissions";
import { eq, and, count } from "drizzle-orm";

export const getUserTeams = protectedProcedure
  .input(
    z.object({
      _challenge: z.string().uuid(),
    })
  )
  .query(async ({ input, ctx }) => {
    const userTeams = await dbSocket
      .select({
        id: teams.id,
        name: teams.name,
        max_members: teams.max_members,
        created_at: teams.created_at,
        memberCount: count(teamMembers._clerk),
        hasSubmission: submissions.id,
      })
      .from(teams)
      .innerJoin(teamMembers, eq(teams.id, teamMembers._team))
      .leftJoin(
        submissions,
        and(
          eq(submissions._team, teams.id),
          eq(submissions._challenge, input._challenge)
        )
      )
      .where(eq(teamMembers._clerk, ctx.auth.userId))
      .groupBy(
        teams.id,
        teams.name,
        teams.max_members,
        teams.created_at,
        submissions.id
      );

    return userTeams.map((team) => ({
      id: team.id,
      name: team.name,
      max_members: team.max_members,
      created_at: team.created_at,
      memberCount: team.memberCount,
      hasSubmission: !!team.hasSubmission,
    }));
  });
