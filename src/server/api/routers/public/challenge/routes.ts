import { createTRPCRouter } from "~/server/api/trpc";
import { all } from "~/server/api/routers/public/challenge/procedures/all";
import { details } from "~/server/api/routers/public/challenge/procedures/details";

export const challengeRouter = createTRPCRouter({
  all,
  details,
});
