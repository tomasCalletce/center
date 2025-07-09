import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { dbSocket } from "~/server/db/connection";
import {
  teamInvitations,
  teamInvitationStatusValues,
} from "~/server/db/schemas/team-invitations";
import {
  teamMemberRoleValues,
  teamMembers,
} from "~/server/db/schemas/team-members";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";
import { clerkClient } from "~/server/api/auth";
import { addDays } from "date-fns";

export const sendInvitation = protectedProcedure
  .input(
    z.object({
      _team: z.string().uuid(),
      emails: z.string().email(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [teamMember] = await dbSocket
      .select({
        _team: teamMembers._team,
        _clerk: teamMembers._clerk,
        role: teamMembers.role,
      })
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.role, teamMemberRoleValues.ADMIN),
          eq(teamMembers._team, input._team),
          eq(teamMembers._clerk, ctx.auth.userId)
        )
      );
    if (!teamMember) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team not found or you are not a admin of this team",
      });
    }

    const clerkUsers = await clerkClient.users.getUserList({
      emailAddress: [input.emails],
    });
    const inviteeUser = clerkUsers.data.find(
      (user) => user.emailAddresses[0]?.emailAddress === input.emails
    );
    if (!inviteeUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const [existingInvitation] = await dbSocket
      .select({
        _team: teamInvitations._team,
        _invitee: teamInvitations._invitee,
        status: teamInvitations.status,
      })
      .from(teamInvitations)
      .where(
        and(
          eq(teamInvitations._team, input._team),
          eq(teamInvitations._invitee, inviteeUser.id),
          eq(teamInvitations.status, teamInvitationStatusValues.PENDING)
        )
      );
    if (existingInvitation) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User already has a pending invitation",
      });
    }

    const [existingMember] = await dbSocket
      .select({
        _team: teamMembers._team,
        _clerk: teamMembers._clerk,
        role: teamMembers.role,
      })
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers._team, input._team),
          eq(teamMembers._clerk, inviteeUser.id)
        )
      );
    if (existingMember) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User is already a team member",
      });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const [newInvitation] = await dbSocket
      .insert(teamInvitations)
      .values({
        _team: input._team,
        _inviter: ctx.auth.userId,
        _invitee: inviteeUser.id,
        expires_at: addDays(new Date(), 7),
      })
      .returning({
        id: teamInvitations.id,
      });
    if (!newInvitation) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to send invitation",
      });
    }

    return newInvitation;
  });
