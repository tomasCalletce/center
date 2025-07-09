import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { dbSocket } from "~/server/db/connection";
import { teamInvitations } from "~/server/db/schemas/team-invitations";
import { teamMembers } from "~/server/db/schemas/team-members";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";
import { teamInvitationStatusValues } from "~/server/db/schemas/team-invitations";
import { teamMemberRoleValues } from "~/server/db/schemas/team-members";

export const respondToInvitation = protectedProcedure
  .input(
    z.object({
      _invitation: z.string().uuid(),
      response: z.enum([
        teamInvitationStatusValues.ACCEPTED,
        teamInvitationStatusValues.DECLINED,
      ]),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [invitation] = await dbSocket
      .select()
      .from(teamInvitations)
      .where(
        and(
          eq(teamInvitations.id, input._invitation),
          eq(teamInvitations._invitee, ctx.auth.userId),
          eq(teamInvitations.status, teamInvitationStatusValues.PENDING)
        )
      );
    if (!invitation) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Invitation not found",
      });
    }

    if (new Date() > invitation.expires_at) {
      await dbSocket
        .update(teamInvitations)
        .set({ status: teamInvitationStatusValues.EXPIRED })
        .where(eq(teamInvitations.id, input._invitation));

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invitation has expired",
      });
    }

    const result = await dbSocket.transaction(async (tx) => {
      const [updatedInvitation] = await tx
        .update(teamInvitations)
        .set({
          status: input.response,
          responded_at: new Date(),
        })
        .where(eq(teamInvitations.id, input._invitation))
        .returning({
          id: teamInvitations.id,
        });
      if (!updatedInvitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not updated",
        });
      }

      if (input.response === teamInvitationStatusValues.ACCEPTED) {
        const [newTeamMember] = await tx
          .insert(teamMembers)
          .values({
            _team: invitation._team,
            _clerk: ctx.auth.userId,
            role: teamMemberRoleValues.MEMBER,
          })
          .returning({
            id: teamMembers.id,
          });
        if (!newTeamMember) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Team member not created",
          });
        }

        return { invitation: updatedInvitation, teamMember: newTeamMember };
      }

      return { invitation: updatedInvitation };
    });

    return result;
  });
