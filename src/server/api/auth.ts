import { createClerkClient } from "@clerk/nextjs/server";
import { env } from "~/env";

export const clerkClient = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
});
