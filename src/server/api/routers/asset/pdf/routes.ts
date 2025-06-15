import { createTRPCRouter } from "~/server/api/trpc";
import { createCV } from "~/server/api/routers/asset/pdf/procedures/create-cv";

export const assetPdfRouter = createTRPCRouter({
  createCV,
});
