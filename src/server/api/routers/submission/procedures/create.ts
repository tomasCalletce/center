import { protectedProcedure } from "~/server/api/trpc";
import { assets } from "~/server/db/schemas/asset";
import { submissions } from "~/server/db/schemas/submissions";
import { TRPCError } from "@trpc/server";
import { db, dbSocket } from "~/server/db/connection";
import { verifySubmissionsSchema } from "~/server/db/schemas/submissions";
import { images } from "~/server/db/schemas/images";

export const create = protectedProcedure
  .input(verifySubmissionsSchema)
  .mutation(async ({ input, ctx }) => {
    const result = await dbSocket.transaction(async (tx) => {
      const [newAsset] = await tx
        .insert(assets)
        .values({
          _clerk: ctx.auth.userId,
          pathname: input.verifyImagesSchema.verifyAssetsSchema.pathname,
          url: input.verifyImagesSchema.verifyAssetsSchema.url,
        })
        .returning({ id: assets.id });
      if (!newAsset) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create asset in database.",
        });
      }

      const [newImage] = await tx
        .insert(images)
        .values({
          _clerk: ctx.auth.userId,
          _asset: newAsset.id,
          alt: input.verifyImagesSchema.alt,
        })
        .returning({ id: images.id });
      if (!newImage) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create image in database.",
        });
      }

      const [newSubmission] = await tx
        .insert(submissions)
        .values({
          _clerk: ctx.auth.userId,
          _logo_image: newImage.id,
          _challenge: input._challenge,
          title: input.title,
          description: input.description,
          demo_url: input.demo_url,
          repository_url: input.repository_url,
          status: input.status,
        })
        .returning({ id: submissions.id });
      if (!newSubmission) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create submission in database.",
        });
      }

      return newSubmission;
    });

    return result;
  });
