import { protectedProcedure } from "~/server/api/trpc";
import { verifyAssetsPdfSchema } from "~/server/db";
import { assetsPdf } from "~/server/db/schemas/assets-pdf";
import { TRPCError } from "@trpc/server";
import { dbSocket } from "~/server/db/connection";
import { mainOnboardingTask } from "~/server/trigger/cv-processing/main-onboarding-task";
import { assets } from "~/server/db/schemas/asset";

export const createCV = protectedProcedure
  .input(verifyAssetsPdfSchema)
  .mutation(async ({ input, ctx }) => {
    const result = await dbSocket.transaction(async (tx) => {
      const [newAsset] = await tx
        .insert(assets)
        .values({
          _clerk: ctx.auth.userId,
          pathname: input.verifyAssetsSchema.pathname,
          url: input.verifyAssetsSchema.url,
        })
        .returning({ id: assets.id });
      if (!newAsset) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create asset in database.",
        });
      }

      const [newCV] = await tx
        .insert(assetsPdf)
        .values({
          _clerk: ctx.auth.userId,
          _asset: newAsset.id,
          type: input.type,
        })
        .returning({ id: assetsPdf.id });
      if (!newCV) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create asset pdf in database.",
        });
      }

      return { newAsset, newCV };
    });

    const triggerTask = await mainOnboardingTask.trigger(
      {
        cv: {
          id: result.newCV.id,
          url: input.verifyAssetsSchema.url,
        },
        userId: ctx.auth.userId,
      },
      {
        tags: [ctx.auth.userId],
      }
    );
    if (!triggerTask.id) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to trigger main onboarding task.",
      });
    }

    return {
      pdf: result.newCV,
      asset: result.newAsset,
      triggerTask: triggerTask,
    };
  });
