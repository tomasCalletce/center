import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { dbSocket } from "~/server/db/connection";
import { teams } from "~/server/db/schemas/teams";
import { teamMembers } from "~/server/db/schemas/team-members";
import { TRPCError } from "@trpc/server";

export const createTeam = protectedProcedure
  .input(
    z.object({
      name: z.string().min(1).max(255),
      challengeId: z.string().uuid(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const result = await dbSocket.transaction(async (tx) => {
      const [newTeam] = await tx
        .insert(teams)
        .values({
          _clerk: ctx.auth.userId,
          name: input.name,
          max_members: 5,
        })
        .returning({ id: teams.id });

      if (!newTeam) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create team",
        });
      }

      const [newTeamMember] = await tx
        .insert(teamMembers)
        .values({
          _team: newTeam.id,
          _clerk: ctx.auth.userId,
          role: "ADMIN",
        })
        .returning({ id: teamMembers.id });

      if (!newTeamMember) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add team member",
        });
      }

      return newTeam;
    });

    return result;
  }); 