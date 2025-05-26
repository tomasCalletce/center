import { protectedProcedure } from "~/server/api/trpc";
import { verifyDocumentsSchema } from "~/server/db";
import { documents } from "~/server/db/schemas/documents";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db/connection";

export const createCV = protectedProcedure
  .input(verifyDocumentsSchema)
  .mutation(async ({ input, ctx }) => {
    const [newCV] = await db
      .insert(documents)
      .values({
        _clerk: ctx.auth.userId,
        pathname: input.pathname,
        type: input.type,
        fileType: input.fileType,
      })
      .returning({ id: documents.id });
    if (!newCV) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create document in database.",
      });
    }

    return newCV;
  });
