import { createTRPCRouter } from "~/server/api/trpc";
import { challengeRouter } from "~/server/api/routers/public/challenge/routes";

export const publicRouter = createTRPCRouter({
  challenge: challengeRouter,
});
