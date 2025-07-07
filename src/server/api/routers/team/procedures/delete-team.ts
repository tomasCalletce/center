import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { dbSocket } from "~/server/db/connection";
import { teams } from "~/server/db/schemas/teams";
import { teamMembers } from "~/server/db/schemas/team-members";
import { submissions } from "~/server/db/schemas/submissions";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";

export const deleteTeam = protectedProcedure
  .input(
    z.object({
      teamId: z.string().uuid(),
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
        message: "Only team admins can delete teams",
      });
    }

    const [existingSubmission] = await dbSocket
      .select()
      .from(submissions)
      .where(eq(submissions._team, input.teamId))
      .limit(1);

    if (existingSubmission) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot delete team with existing submissions",
      });
    }

    const [deletedTeam] = await dbSocket
      .delete(teams)
      .where(eq(teams.id, input.teamId))
      .returning();

    if (!deletedTeam) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team not found",
      });
    }

    return deletedTeam;
  }); 