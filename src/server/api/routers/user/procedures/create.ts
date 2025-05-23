import { protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const create = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    console.log("que mas");
  });
