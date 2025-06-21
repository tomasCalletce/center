import { createTRPCRouter } from "~/server/api/trpc";
import { getProfile } from "~/server/api/routers/user/procedures/get-profile";
import { updateProfile } from "~/server/api/routers/user/procedures/update-profile";

export const userRouter = createTRPCRouter({
  getProfile,
  updateProfile,
});