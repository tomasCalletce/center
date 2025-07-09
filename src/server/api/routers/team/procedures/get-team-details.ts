import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { teams } from "~/server/db/schemas/teams";
import { teamMembers } from "~/server/db/schemas/team-members";
import { teamInvitations } from "~/server/db/schemas/team-invitations";
import { users } from "~/server/db/schemas/users";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const getTeamDetails = protectedProcedure
  .input(
    z.object({
      _team: z.string().uuid(),
    })
  )
  .query(async ({ input, ctx }) => {
    const [existingTeam] = await db
      .select({
        id: teams.id,
        name: teams.name,
        max_members: teams.max_members,
        created_at: teams.created_at,
      })
      .from(teams)
      .where(eq(teams.id, input._team));
    if (!existingTeam) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team not found",
      });
    }

    const teammates = await db
      .select({
        _clerk: teamMembers._clerk,
        role: teamMembers.role,
        joined_at: teamMembers.joined_at,
        display_name: users.display_name,
        current_title: users.current_title,
      })
      .from(teamMembers)
      .leftJoin(users, eq(teamMembers._clerk, users._clerk))
      .where(eq(teamMembers._team, input._team));
    const userMember = teammates.find(
      (member) => member._clerk === ctx.auth.userId
    );
    if (!userMember) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not a member of this team",
      });
    }

    const pendingInvitations = await db
      .select({
        id: teamInvitations.id,
        created_at: teamInvitations.created_at,
      })
      .from(teamInvitations)
      .where(eq(teamInvitations._team, input._team));

    return {
      details: existingTeam,
      teammates,
      pendingInvitations,
    };
  });
