import { schemaTask, tasks } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { validateCvTask } from "~/server/trigger/cv-processing/00-validate-cv";
import { splitPdfToImagesTask } from "~/server/trigger/cv-processing/01-split-pdf-to-images";
import { imageToMarkdownTask } from "~/server/trigger/cv-processing/02-image-to-markdown";
import { consolidatedMarkdownTask } from "~/server/trigger/cv-processing/03-consolidated-markdown";
import { extractJsonStructureTask } from "~/server/trigger/cv-processing/04-extract-json-structure";
import { metadata } from "@trigger.dev/sdk/v3";
import { ONBOARDING_PROGRESS } from "~/types/onboarding";

export const mainOnboardingTask = schemaTask({
  id: "onboarding.main",
  schema: z.object({
    cv: z.object({
      id: z.string(),
      url: z.string(),
    }),
    userId: z.string(),
  }),
  retry: {
    maxAttempts: 1,
  },
  run: async ({ cv, userId }) => {
    metadata.set("status", ONBOARDING_PROGRESS.VALIDATING_CV);
    const cvValidation = await tasks.triggerAndWait<typeof validateCvTask>(
      "onboarding.validate-cv",
      {
        cv: {
          id: cv.id,
          url: cv.url,
        },
        userId,
      },
      {
        tags: [userId],
      }
    );
    if (!cvValidation.ok) {
      throw new Error(`CV validation failed: ${cvValidation.error}`);
    }

    metadata.set("status", ONBOARDING_PROGRESS.CONVERTING_PDF_TO_IMAGES);
    const splitPdfToImages = await tasks.triggerAndWait<
      typeof splitPdfToImagesTask
    >(
      "onboarding.split-pdf-to-images",
      {
        cv: {
          id: cv.id,
          url: cv.url,
        },
        userId,
      },
      {
        tags: [userId],
      }
    );
    if (!splitPdfToImages.ok) {
      throw new Error(`Task failed: ${splitPdfToImages.error}`);
    }

    metadata.set("status", ONBOARDING_PROGRESS.CONVERTING_IMAGES_TO_MARKDOWN);
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
        tags: [userId],
      }))
    );
    const markdownContent = imageToMarkdownResults.runs.map((run) => {
      if (run.ok) {
        return run.output.markdown;
      }
      throw new Error(`Task failed: ${run.error}`);
    });

    metadata.set("status", ONBOARDING_PROGRESS.CONSOLIDATING_MARKDOWN);
    const consolidatedMarkdown = await tasks.triggerAndWait<
      typeof consolidatedMarkdownTask
    >(
      "onboarding.consolidated-markdown",
      {
        cv: {
          id: cv.id,
          url: cv.url,
        },
        markdownContents: markdownContent,
        userId,
      },
      {
        tags: [userId],
      }
    );
    if (!consolidatedMarkdown.ok) {
      throw new Error(`Consolidation failed: ${consolidatedMarkdown.error}`);
    }

    metadata.set(
      "status",
      ONBOARDING_PROGRESS.EXTRACTING_JSON_STRUCTURE_AND_SAVING_TO_DATABASE
    );
    const extractJsonStructure = await tasks.triggerAndWait<
      typeof extractJsonStructureTask
    >(
      "onboarding.extract-json-structure",
      {
        markdown: {
          content: consolidatedMarkdown.output.rawMarkdown,
        },
        userId,
      },
      {
        tags: [userId],
      }
    );
    if (!extractJsonStructure.ok) {
      throw new Error(`Extraction failed: ${extractJsonStructure.error}`);
    }

    return {
      success: true,
      user: extractJsonStructure.output.userId,
    };
  },
});
