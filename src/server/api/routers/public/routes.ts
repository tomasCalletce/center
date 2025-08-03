import { createTRPCRouter } from "~/server/api/trpc";
import { challengeRouter } from "~/server/api/routers/public/challenge/routes";
import { publicBlogRouter } from "~/server/api/routers/public/blog/routes";

export const publicRouter = createTRPCRouter({
  challenge: challengeRouter,
  blog: publicBlogRouter,
});
