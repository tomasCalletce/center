import { createTRPCRouter } from "~/server/api/trpc";
import { all } from "./procedures/all";
import { details } from "./procedures/details";

export const publicBlogRouter = createTRPCRouter({
  all,
  details,
});