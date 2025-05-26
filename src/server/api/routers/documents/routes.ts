import { createTRPCRouter } from "~/server/api/trpc";
import { create } from "~/server/api/routers/user/procedures/create";

export const userRouter = createTRPCRouter({
  create,
});
