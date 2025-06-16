import { createTRPCRouter } from "~/server/api/trpc";
import { create } from "~/server/api/routers/challenge/procedures/create";
import { update } from "~/server/api/routers/challenge/procedures/update";
import { all } from "~/server/api/routers/challenge/procedures/all";
import { details } from "~/server/api/routers/challenge/procedures/details";
import { participant } from "~/server/api/routers/challenge/procedures/participant";
import { allSubmissions } from "~/server/api/routers/challenge/procedures/all-submission";

export const challengeRouter = createTRPCRouter({
  create,
  update,
  all,
  details,
  participant,
  allSubmissions,
});
