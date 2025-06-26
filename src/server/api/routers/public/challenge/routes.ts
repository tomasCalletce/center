import { createTRPCRouter } from "~/server/api/trpc";
import { all } from "~/server/api/routers/public/challenge/procedures/all";
import { details } from "~/server/api/routers/public/challenge/procedures/details";
import { participants } from "~/server/api/routers/public/challenge/procedures/participants";
import { notifyInterest } from "~/server/api/routers/public/challenge/procedures/notify-interest";

export const challengeRouter = createTRPCRouter({
  all,
  details,
  participants,
  notifyInterest,
});
