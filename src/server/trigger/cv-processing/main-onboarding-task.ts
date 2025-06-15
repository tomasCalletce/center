import { schemaTask, tasks } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { splitPdfToImagesTask } from "~/server/trigger/cv-processing/01-split-pdf-to-images";
import { imageToMarkdownTask } from "~/server/trigger/cv-processing/02-image-to-markdown";

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
    const splitPdfToImages = await tasks.triggerAndWait<
      typeof splitPdfToImagesTask
    >("onboarding.split-pdf-to-images", {
      cv: {
        id: cv.id,
        url: cv.url,
      },
      userId,
    });
    if (!splitPdfToImages.ok) {
      throw new Error(`Task failed: ${splitPdfToImages.error}`);
    }

    const imageToMarkdownResults = await tasks.batchTriggerAndWait<
      typeof imageToMarkdownTask
    >(
      "onboarding.image-to-markdown",
      splitPdfToImages.output.imageUrls.map(({ id, url, pageNumber }) => ({
        payload: {
          image: {
            id,
            url,
            pageNumber,
          },
          userId,
        },
      }))
    );

    imageToMarkdownResults.runs.map((run) => {
      if (run.ok) {
        return run.output;
      }
      throw new Error(`Task failed: ${run.error}`);
    });

    return {
      success: true,
    };
  },
});
