import { schemaTask, tasks } from "@trigger.dev/sdk/v3";
import { z } from "zod";

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
    const splitPdfToImages = await tasks.triggerAndWait("split-pdf-to-images", {
      cv: {
        id: cv.id,
        url: cv.url,
      },
      userId,
    });
    if (!splitPdfToImages.ok) {
      throw new Error(`Task failed: ${splitPdfToImages.error}`);
    }

    return {
      success: true,
    };
  },
});
