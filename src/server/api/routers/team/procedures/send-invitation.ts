import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { dbSocket } from "~/server/db/connection";
import { teamInvitations } from "~/server/db/schemas/team-invitations";
import { teamMembers } from "~/server/db/schemas/team-members";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";
import { clerkClient } from "~/server/api/auth";

export const sendInvitation = protectedProcedure
  .input(
    z.object({
      teamId: z.string().uuid(),
      inviteeEmails: z.array(z.string().email()),
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

    const results = [];
    const errors = [];

    for (const email of input.inviteeEmails) {
      try {
        const clerkUsers = await clerkClient.users.getUserList({
          emailAddress: [email],
        });

        if (clerkUsers.data.length === 0) {
          errors.push(`No user found with email: ${email}`);
          continue;
        }

        const inviteeUser = clerkUsers.data[0];
        if (!inviteeUser) {
          errors.push(`No user found with email: ${email}`);
          continue;
        }

        const inviteeClerkId = inviteeUser.id;

        const existingInvitation = await dbSocket
          .select()
          .from(teamInvitations)
          .where(
            and(
              eq(teamInvitations._team, input.teamId),
              eq(teamInvitations._invitee, inviteeClerkId),
              eq(teamInvitations.status, "PENDING")
            )
          );

        if (existingInvitation.length > 0) {
          errors.push(`User ${email} already has a pending invitation`);
          continue;
        }

        const existingMember = await dbSocket
          .select()
          .from(teamMembers)
          .where(
            and(
              eq(teamMembers._team, input.teamId),
              eq(teamMembers._clerk, inviteeClerkId)
            )
          );

        if (existingMember.length > 0) {
          errors.push(`User ${email} is already a team member`);
          continue;
        }

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const [newInvitation] = await dbSocket
          .insert(teamInvitations)
          .values({
            _team: input.teamId,
            _inviter: ctx.auth.userId,
            _invitee: inviteeClerkId,
            message: input.message,
            expires_at: expiresAt,
          })
          .returning();

        results.push({ email, invitation: newInvitation });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to send invitation to ${email}: ${errorMessage}`);
      }
    }

    return {
      success: results,
      errors,
    };
  });
