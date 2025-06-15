import { protectedProcedure } from "~/server/api/trpc";
import { verifyDocumentsSchema } from "~/server/db";
import { documents } from "~/server/db/schemas/documents";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db/connection";
import { mainOnboardingTask } from "~/server/trigger/pdf-processing/main-onboarding-task";

export const createCV = protectedProcedure
  .input(verifyDocumentsSchema)
  .mutation(async ({ input, ctx }) => {
    const [newCV] = await db
      .insert(documents)
      .values({
        _clerk: ctx.auth.userId,
        pathname: input.pathname,
        url: input.url,
        type: input.type,
        content_type: input.content_type,
      })
      .returning({ id: documents.id });
    if (!newCV) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create document in database.",
      });
    }

    const handle = await mainOnboardingTask.trigger({
      cv: {
        id: newCV.id,
        url: input.url,
      },
      userId: ctx.auth.userId,
    });
    if (!handle) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to trigger main onboarding task.",
      });
    }

    return {
      document: newCV,
    };
  });
