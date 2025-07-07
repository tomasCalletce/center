import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { dbSocket } from "~/server/db/connection";
import { teamInvitations } from "~/server/db/schemas/team-invitations";
import { teamMembers } from "~/server/db/schemas/team-members";
import { teams } from "~/server/db/schemas/teams";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";

export const sendInvitation = protectedProcedure
  .input(
    z.object({
      teamId: z.string().uuid(),
      inviteeClerkId: z.string(),
      message: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [teamMember] = await dbSocket
      .select()
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers._team, input.teamId),
          eq(teamMembers._clerk, ctx.auth.userId)
        )
      );

    if (!teamMember || teamMember.role !== "ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only team admins can send invitations",
      });
    }

    const existingInvitation = await dbSocket
      .select()
      .from(teamInvitations)
      .where(
        and(
          eq(teamInvitations._team, input.teamId),
          eq(teamInvitations._invitee, input.inviteeClerkId),
          eq(teamInvitations.status, "PENDING")
        )
      );

    if (existingInvitation.length > 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User already has a pending invitation",
      });
    }

    const existingMember = await dbSocket
      .select()
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers._team, input.teamId),
          eq(teamMembers._clerk, input.inviteeClerkId)
        )
      );

    if (existingMember.length > 0) {
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
        _team: input.teamId,
        _inviter: ctx.auth.userId,
        _invitee: input.inviteeClerkId,
        message: input.message,
        expires_at: expiresAt,
      })
      .returning();

    return newInvitation;
  }); 