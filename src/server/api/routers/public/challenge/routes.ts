import { createTRPCRouter } from "~/server/api/trpc";
import { all } from "~/server/api/routers/public/challenge/procedures/all";
import { detailsBySlug } from "~/server/api/routers/public/challenge/procedures/details-by-slug";
import { details } from "~/server/api/routers/public/challenge/procedures/details";
import { allSubmissions } from "~/server/api/routers/challenge/procedures/all-submission";

export const challengeRouter = createTRPCRouter({
  all,
  detailsBySlug,
  details,
  allSubmissions,
});
