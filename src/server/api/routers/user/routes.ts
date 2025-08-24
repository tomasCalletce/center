import { createTRPCRouter } from "~/server/api/trpc";
import { getProfile } from "~/server/api/routers/user/procedures/get-profile";
import { updateProfile } from "~/server/api/routers/user/procedures/update-profile";
import { ensureUserExists } from "./procedures/ensure-user-exists";
import { syncClerkData } from "./procedures/sync-clerk-data";

export const userRouter = createTRPCRouter({
  getProfile,
  updateProfile,
  ensureUserExists,
  syncClerkData,
});