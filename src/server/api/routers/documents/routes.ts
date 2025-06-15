import { createTRPCRouter } from "~/server/api/trpc";
import { createCV } from "~/server/api/routers/documents/procedures/create-cv";

export const documentsRouter = createTRPCRouter({
  createCV,
});
