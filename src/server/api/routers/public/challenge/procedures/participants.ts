import { publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { challenges } from "~/server/db/schemas/challenges";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { participationIntents } from "~/server/db/schemas/participation-intents";
import { users } from "~/server/db/schemas/users";

export const participants = publicProcedure
  .input(
    z
      .object({
        _challenge: z.string().uuid().optional(),
        challenge_slug: z.string().optional(),
      })
      .refine((data) => data._challenge || data.challenge_slug, {
        message: "Either challenge ID or slug must be provided",
      })
  )
  .query(async ({ input }) => {
    const whereCondition = input._challenge
      ? eq(challenges.id, input._challenge)
      : eq(challenges.slug, input.challenge_slug!);

    const allParticipantsIntents = await db
      .select({
        id: participationIntents.id,
        user: {
          _clerk: users._clerk,
          display_name: users.display_name,
        },
        updated_at: participationIntents.updated_at,
        created_at: participationIntents.created_at,
      })
      .from(participationIntents)
      .innerJoin(challenges, eq(participationIntents._challenge, challenges.id))
      .innerJoin(users, eq(participationIntents._clerk, users._clerk))
      .where(whereCondition);

    if (!allParticipantsIntents) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Challenge not found",
      });
    }

    return allParticipantsIntents;
  });
