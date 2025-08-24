import { publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { challenges } from "~/server/db/schemas/challenges";
import { submissions } from "~/server/db/schemas/submissions";
import { teams } from "~/server/db/schemas/teams";
import { users } from "~/server/db/schemas/users";
import { assetsImages } from "~/server/db/schemas/assets-images";
import { assets } from "~/server/db/schemas/asset";
import { z } from "zod";
import { eq, desc, count } from "drizzle-orm";
import { fromZonedTime } from "date-fns-tz";
import { TRPCError } from "@trpc/server";

export const allSubmissions = publicProcedure
  .input(
    z
      .object({
        _challenge: z.string().uuid().optional(),
        challenge_slug: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
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

    // Hide submissions publicly until the challenge deadline has passed (Bogotá time)
    const now = new Date();
    const colombiaTimeZone = "America/Bogota";
    const deadlineUtc = challenge.deadline_at
      ? fromZonedTime(challenge.deadline_at, colombiaTimeZone)
      : null;
    if (deadlineUtc && now < deadlineUtc) {
      return {
        submissions: [],
        totalCount: 0,
      };
    }

    const [submissionCount] = await db
      .select({ count: count() })
      .from(submissions)
      .where(eq(submissions._challenge, challenge.id));

    const allSubmissions = await db
      .select({
        id: submissions.id,
        title: submissions.title,
        created_at: submissions.created_at,
        demo_url: submissions.demo_url,
        video_demo_url: submissions.video_demo_url,
        repository_url: submissions.repository_url,
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
      .limit(input.limit)
      .offset(input.offset);

    return {
      submissions: allSubmissions,
      totalCount: submissionCount?.count || 0,
    };
  });



