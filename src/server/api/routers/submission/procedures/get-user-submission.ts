import { protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { submissions } from "~/server/db/schemas/submissions";
import { teams } from "~/server/db/schemas/teams";
import { teamMembers } from "~/server/db/schemas/team-members";
import { assetsImages } from "~/server/db/schemas/assets-images";
import { assets } from "~/server/db/schemas/asset";
import { z } from "zod";
import { eq, and } from "drizzle-orm";

export const getUserSubmission = protectedProcedure
  .input(z.object({ challengeId: z.string().uuid() }))
  .query(async ({ input, ctx }) => {
    const userSubmission = await db
      .select({
        id: submissions.id,
        title: submissions.title,
        markdown: submissions.markdown,
        demo_url: submissions.demo_url,
        repository_url: submissions.repository_url,
        status: submissions.status,
        created_at: submissions.created_at,
        logo_image: {
          id: assetsImages.id,
          alt: assetsImages.alt,
          url: assets.url,
          pathname: assets.pathname,
        },
      })
      .from(submissions)
      .innerJoin(teams, eq(submissions._team, teams.id))
      .innerJoin(teamMembers, eq(teams.id, teamMembers._team))
      .leftJoin(assetsImages, eq(submissions._logo_image, assetsImages.id))
      .leftJoin(assets, eq(assetsImages._asset, assets.id))
      .where(
        and(
          eq(submissions._challenge, input.challengeId),
          eq(teamMembers._clerk, ctx.auth.userId)
        )
      )
      .limit(1);

    return userSubmission.at(0) ?? null;
  }); 