import { createTRPCRouter } from "~/server/api/trpc";
import { create } from "~/server/api/routers/challenge/procedures/create";
import { getSubmissions } from "~/server/api/routers/challenge/procedures/get-submissions";

export const challengeRouter = createTRPCRouter({
  create,
  getSubmissions,
});
