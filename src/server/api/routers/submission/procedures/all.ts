import { protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { challenges } from "~/server/db/schemas/challenges";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { submissions } from "~/server/db/schemas/submissions";
import { assetsImages } from "~/server/db/schemas/assets-images";
import { assets } from "~/server/db/schemas/asset";

export const all = protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).default(10),
      offset: z.number().min(0).default(0),
    })
  )
  .query(async ({ input, ctx }) => {
    const allChallenges = await db
      .select({
        id: submissions.id,
        title: submissions.title,
        markdown: submissions.markdown,
        status: submissions.status,
        created_at: submissions.created_at,
        updated_at: submissions.updated_at,
        challenge: {
          id: challenges.id,
          title: challenges.title,
        },
        image: {
          pathname: assets.pathname,
          url: assets.url,
          alt: assetsImages.alt,
        },
      })
      .from(submissions)
      .innerJoin(challenges, eq(submissions._challenge, challenges.id))
      .innerJoin(assetsImages, eq(challenges._image, assetsImages.id))
      .innerJoin(assets, eq(assetsImages._asset, assets.id))
      .where(eq(submissions._team, ctx.auth.userId))
      .limit(input.limit)
      .offset(input.offset)
      .orderBy(asc(challenges.deadline_at));

    return allChallenges;
  });
