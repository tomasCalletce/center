import { publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { challenges } from "~/server/db/schemas/challenges";
import { submissions } from "~/server/db/schemas/submissions";
import { teams } from "~/server/db/schemas/teams";
import { users } from "~/server/db/schemas/users";
import { assetsImages } from "~/server/db/schemas/assets-images";
import { assets } from "~/server/db/schemas/asset";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { fromZonedTime } from "date-fns-tz";
import { TRPCError } from "@trpc/server";

export const recentSubmissions = publicProcedure
  .input(
    z
      .object({
        _challenge: z.string().uuid().optional(),
        challenge_slug: z.string().optional(),
        limit: z.number().min(1).max(10).default(5),
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
        deadline_at: challenges.deadline_at,
      })
      .from(challenges)
      .where(whereCondition);

    if (!challenge) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Challenge not found",
      });
    }

    // If deadline has not passed in Bogotá time, do not expose recent submissions
    const colombiaTimeZone = "America/Bogota";
    const now = new Date();
    const deadlineUtc = challenge.deadline_at
      ? fromZonedTime(challenge.deadline_at, colombiaTimeZone)
      : null;
    if (deadlineUtc && now < deadlineUtc) {
      return [];
    }

    const recentSubmissions = await db
      .select({
        id: submissions.id,
        title: submissions.title,
        created_at: submissions.created_at,
        team: {
          name: teams.name,
        },
        submitted_by: {
          display_name: users.display_name,
        },
        logo_image: {
          url: assets.url,
          alt: assetsImages.alt,
        },
      })
      .from(submissions)
      .leftJoin(teams, eq(submissions._team, teams.id))
      .leftJoin(users, eq(submissions.submitted_by, users._clerk))
      .leftJoin(assetsImages, eq(submissions._logo_image, assetsImages.id))
      .leftJoin(assets, eq(assetsImages._asset, assets.id))
      .where(eq(submissions._challenge, challenge.id))
      .orderBy(desc(submissions.created_at))
      .limit(input.limit);

    return recentSubmissions;
  }); 