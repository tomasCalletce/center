import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { teams } from "~/server/db/schemas/teams";
import { teamMembers } from "~/server/db/schemas/team-members";
import { teamInvitations } from "~/server/db/schemas/team-invitations";
import { users } from "~/server/db/schemas/users";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";

export const getTeamDetails = protectedProcedure
  .input(
    z.object({
      _team: z.string().uuid(),
    })
  )
  .query(async ({ input, ctx }) => {
    const results = await db
      .select({
        teamId: teams.id,
        teamName: teams.name,
        memberRole: teamMembers.role,
        memberClerk: teamMembers._clerk,
        memberDisplayName: users.display_name,
        memberCurrentTitle: users.current_title,
        memberJoinedAt: teamMembers.joined_at,
      })
      .from(teams)
      .innerJoin(teamMembers, eq(teams.id, teamMembers._team))
      .leftJoin(users, eq(teamMembers._clerk, users._clerk))
      .where(eq(teams.id, input._team));
    if (results.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team not found",
      });
    }

    const userMember = results.find((r) => r.memberClerk === ctx.auth.userId);
    if (!userMember) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not a member of this team",
      });
    }

    return {
      id: results[0]?.teamId,
      name: results[0]?.teamName,
      members: results.map((r) => ({
        _clerk: r.memberClerk,
        role: r.memberRole,
        joined_at: r.memberJoinedAt,
        display_name: r.memberDisplayName,
        current_title: r.memberCurrentTitle,
      })),
      userRole: userMember.memberRole,
    };
  });
