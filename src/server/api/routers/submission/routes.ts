import { createTRPCRouter } from "~/server/api/trpc";
import { create, update } from "~/server/api/routers/submission/procedures/create";
import { all } from "~/server/api/routers/submission/procedures/all";
import { getUserSubmission } from "~/server/api/routers/submission/procedures/get-user-submission";

export const submissionRouter = createTRPCRouter({
  create,
  update,
  all,
  getUserSubmission,
});
