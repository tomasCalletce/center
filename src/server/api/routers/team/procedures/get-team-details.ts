import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { dbSocket } from "~/server/db/connection";
import { teams } from "~/server/db/schemas/teams";
import { teamMembers } from "~/server/db/schemas/team-members";
import { teamInvitations } from "~/server/db/schemas/team-invitations";
import { users } from "~/server/db/schemas/users";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";
import { clerkClient } from "~/server/api/auth";

export const getTeamDetails = protectedProcedure
  .input(
    z.object({
      teamId: z.string().uuid(),
    })
  )
  .query(async ({ input, ctx }) => {
    const [team] = await dbSocket
      .select({
        id: teams.id,
        name: teams.name,
        max_members: teams.max_members,
        created_at: teams.created_at,
      })
      .from(teams)
      .where(eq(teams.id, input.teamId));

    if (!team) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team not found",
      });
    }

    const [userMembership] = await dbSocket
      .select()
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers._team, input.teamId),
          eq(teamMembers._clerk, ctx.auth.userId)
        )
      );

    if (!userMembership) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not a member of this team",
      });
    }

    const memberRecords = await dbSocket
      .select({
        id: teamMembers.id,
        role: teamMembers.role,
        joined_at: teamMembers.joined_at,
        _clerk: teamMembers._clerk,
        user: {
          _clerk: users._clerk,
          display_name: users.display_name,
          current_title: users.current_title,
        },
      })
      .from(teamMembers)
      .leftJoin(users, eq(teamMembers._clerk, users._clerk))
      .where(eq(teamMembers._team, input.teamId));

    const members = await Promise.all(
      memberRecords.map(async (member) => {
        if (!member.user?.display_name) {
          try {
            const clerkUser = await clerkClient.users.getUser(member._clerk);
            return {
              ...member,
              user: {
                ...member.user,
                _clerk: member._clerk,
                display_name: clerkUser.fullName || clerkUser.firstName || null,
                current_title: member.user?.current_title || null,
              },
            };
          } catch (error) {
            return {
              ...member,
              user: {
                ...member.user,
                _clerk: member._clerk,
                display_name: null,
                current_title: member.user?.current_title || null,
              },
            };
          }
        }
        return member;
      })
    );

    const pendingInvitations = await dbSocket
      .select({
        id: teamInvitations.id,
        message: teamInvitations.message,
        expires_at: teamInvitations.expires_at,
        created_at: teamInvitations.created_at,
        invitee: {
          _clerk: users._clerk,
          display_name: users.display_name,
        },
      })
      .from(teamInvitations)
      .innerJoin(users, eq(teamInvitations._invitee, users._clerk))
      .where(
        and(
          eq(teamInvitations._team, input.teamId),
          eq(teamInvitations.status, "PENDING")
        )
      );

    return {
      ...team,
      members,
      pendingInvitations,
      userRole: userMembership.role,
    };
  }); 