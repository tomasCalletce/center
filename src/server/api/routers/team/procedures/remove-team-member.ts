import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { dbSocket } from "~/server/db/connection";
import { teamMembers } from "~/server/db/schemas/team-members";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";

export const removeTeamMember = protectedProcedure
  .input(
    z.object({
      teamId: z.string().uuid(),
      memberClerkId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [adminMember] = await dbSocket
      .select()
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers._team, input.teamId),
          eq(teamMembers._clerk, ctx.auth.userId)
        )
      );

    if (!adminMember || adminMember.role !== "ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only team admins can remove members",
      });
    }

    if (input.memberClerkId === ctx.auth.userId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You cannot remove yourself from the team",
      });
    }

    const [removedMember] = await dbSocket
      .delete(teamMembers)
      .where(
        and(
          eq(teamMembers._team, input.teamId),
          eq(teamMembers._clerk, input.memberClerkId)
        )
      )
      .returning();

    if (!removedMember) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team member not found",
      });
    }

    return removedMember;
  }); 