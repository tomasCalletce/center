import { createTRPCRouter } from "~/server/api/trpc";
import { assetPdfRouter } from "~/server/api/routers/asset/pdf/routes";

export const assetRouter = createTRPCRouter({
  pdf: assetPdfRouter,
});
