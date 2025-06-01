import { createTRPCRouter } from "~/server/api/trpc";
import { create } from "~/server/api/routers/submission/procedures/create";

export const submissionRouter = createTRPCRouter({
  create,
});
