import { publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { challenges } from "~/server/db/schemas/challenges";
import { submissions } from "~/server/db/schemas/submissions";
import { participationIntents } from "~/server/db/schemas/participation-intents";
import { z } from "zod";
import { eq, count, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const stats = publicProcedure
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

    const [challenge] = await db
      .select({
        id: challenges.id,
      })
      .from(challenges)
      .where(whereCondition);

    if (!challenge) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Challenge not found",
      });
    }

    const [submissionStats] = await db
      .select({
        total_submissions: count(submissions.id),
        recent_submissions: sql<number>`COUNT(CASE WHEN ${submissions.created_at} >= NOW() - INTERVAL '7 days' THEN 1 END)`,
      })
      .from(submissions)
      .where(eq(submissions._challenge, challenge.id));

    const [participantStats] = await db
      .select({
        total_participants: count(participationIntents.id),
      })
      .from(participationIntents)
      .where(eq(participationIntents._challenge, challenge.id));

    return {
      total_submissions: submissionStats?.total_submissions || 0,
      recent_submissions: submissionStats?.recent_submissions || 0,
      total_participants: participantStats?.total_participants || 0,
    };
  }); 