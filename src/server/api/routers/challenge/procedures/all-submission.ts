import { protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { submissions } from "~/server/db/schemas/submissions";
import { images } from "~/server/db/schemas/images";
import { assets } from "~/server/db/schemas/asset";

export const allSubmissions = protectedProcedure
  .input(
    z.object({
      _challenge: z.string().uuid(),
    })
  )
  .query(async ({ input, ctx }) => {
    const allSubmissions = await db
      .select({
        id: submissions.id,
        _clerk: submissions._clerk,
        status: submissions.status,
        title: submissions.title,
        description: submissions.description,
        demo_url: submissions.demo_url,
        repository_url: submissions.repository_url,
        images: {
          pathname: assets.pathname,
          url: assets.url,
          alt: images.alt,
        },
        created_at: submissions.created_at,
        updated_at: submissions.updated_at,
      })
      .from(submissions)
      .innerJoin(images, eq(submissions._logo_image, images.id))
      .innerJoin(assets, eq(images._asset, assets.id))
      .where(
        and(
          eq(submissions._challenge, input._challenge),
          eq(submissions._clerk, ctx.auth.userId)
        )
      );

    return allSubmissions;
  });
