import { createTRPCRouter } from "~/server/api/trpc";
import { create } from "~/server/api/routers/blog/procedures/create";

export const blogRouter = createTRPCRouter({
  create,
});