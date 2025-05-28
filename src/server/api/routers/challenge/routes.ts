import { createTRPCRouter } from "~/server/api/trpc";
import { create } from "~/server/api/routers/challenge/procedures/create";
import { all } from "~/server/api/routers/challenge/procedures/all";

export const challengeRouter = createTRPCRouter({
  create,
  all,
});
