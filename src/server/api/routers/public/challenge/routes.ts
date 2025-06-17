import { createTRPCRouter } from "~/server/api/trpc";
import { all } from "~/server/api/routers/public/challenge/procedures/all";
import { details } from "~/server/api/routers/public/challenge/procedures/details";
import { participant } from "~/server/api/routers/challenge/procedures/participant";
import { allSubmissions } from "~/server/api/routers/challenge/procedures/all-submission";

export const challengeRouter = createTRPCRouter({
  all,
  details,
  participant,
  allSubmissions,
});
