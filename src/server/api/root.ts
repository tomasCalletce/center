import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { challengeRouter } from "~/server/api/routers/challenge/routes";
import { assetRouter } from "~/server/api/routers/asset/routes";
import { submissionRouter } from "~/server/api/routers/submission/routes";
import { protectedRouter } from "~/server/api/routers/protected/routes";
import { publicRouter } from "~/server/api/routers/public/routes";
import { userRouter } from "~/server/api/routers/user/routes";
import { teamRouter } from "~/server/api/routers/team/routes";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  challenge: challengeRouter,
  submission: submissionRouter,
  protected: protectedRouter,
  public: publicRouter,
  asset: assetRouter,
  user: userRouter,
  team: teamRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
