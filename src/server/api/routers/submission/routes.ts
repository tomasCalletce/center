import { createTRPCRouter } from "~/server/api/trpc";
import { create } from "~/server/api/routers/submission/procedures/create";
import { all } from "~/server/api/routers/submission/procedures/all";

export const submissionRouter = createTRPCRouter({
  create,
  all,
});
