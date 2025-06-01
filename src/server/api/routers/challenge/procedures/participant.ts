import { protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import {
  challenges,
  challengeVisibilityValues,
} from "~/server/db/schemas/challenges";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { assets } from "~/server/db/schemas/asset";

export const participant = protectedProcedure
  .input(
    z.object({
      _challenge: z.string().uuid(),
    })
  )
  .query(async ({ input }) => {
    return [];
  });
