import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { dbSocket } from "~/server/db/connection";
import { teams } from "~/server/db/schemas/teams";
import { teamMembers } from "~/server/db/schemas/team-members";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";

export const updateTeam = protectedProcedure
  .input(
    z.object({
      teamId: z.string().uuid(),
      name: z.string().min(1).max(255),
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
        message: "Only team admins can update team details",
      });
    }

    const [updatedTeam] = await dbSocket
      .update(teams)
      .set({
        name: input.name,
        updated_at: new Date(),
      })
      .where(eq(teams.id, input.teamId))
      .returning();

    if (!updatedTeam) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team not found",
      });
    }

    return updatedTeam;
  }); 