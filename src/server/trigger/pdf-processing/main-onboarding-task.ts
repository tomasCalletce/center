import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { logger } from "@trigger.dev/sdk/v3";
import { splitPdfToImagesTask } from "~/server/trigger/pdf-processing/split-pdf-to-images";

export const mainOnboardingTask = schemaTask({
  id: "onboarding.main",
  schema: z.object({
    cv: z.object({
      id: z.string(),
      url: z.string(),
    }),
    userId: z.string(),
  }),
  run: async ({ cv, userId }) => {
    await splitPdfToImagesTask.trigger({
      cv: {
        id: cv.id,
        url: cv.url,
      },
      pathDestination: `${userId}/cv/processed/images/`,
    });

    return {
      success: true,
    };
  },
});
