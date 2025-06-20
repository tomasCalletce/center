import { createTRPCRouter } from "~/server/api/trpc";
import { create } from "~/server/api/routers/challenge/procedures/create";

export const challengeRouter = createTRPCRouter({
  create,
});
