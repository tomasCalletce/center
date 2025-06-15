import { schemaTask, tasks } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { splitPdfToImagesTask } from "~/server/trigger/cv-processing/01-split-pdf-to-images";
import { imageToMarkdownTask } from "~/server/trigger/cv-processing/02-image-to-markdown";
import { consolidatedMarkdownTask } from "~/server/trigger/cv-processing/03-consolidated-markdown";

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
      splitPdfToImages.output.imageUrls.map(({ url }) => ({
        payload: {
          image: {
            url,
          },
          userId,
        },
      }))
    );

    const markdownContent = imageToMarkdownResults.runs.map((run) => {
      if (run.ok) {
        return run.output.markdown;
      }
      throw new Error(`Task failed: ${run.error}`);
    });

    const consolidatedMarkdown = await tasks.triggerAndWait<
      typeof consolidatedMarkdownTask
    >("onboarding.consolidated-markdown", {
      cv: {
        id: cv.id,
        url: cv.url,
      },
      content: markdownContent,
      userId,
    });

    if (!consolidatedMarkdown.ok) {
      throw new Error(`Consolidation failed: ${consolidatedMarkdown.error}`);
    }

    return {
      success: true,
      markdownUrl: consolidatedMarkdown.output.markdownUrl,
      assetId: consolidatedMarkdown.output.assetId,
    };
  },
});
