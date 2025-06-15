import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { put } from "@vercel/blob";
import { dbSocket } from "~/server/db/connection";
import { assets } from "~/server/db/schemas/asset";
import { assetsMarkdown } from "~/server/db/schemas/asset-markdown";
import { pdfMarkdowns } from "~/server/db/schemas/pdf-markdowns";

export const consolidatedMarkdownTask = schemaTask({
  id: "onboarding.consolidated-markdown",
  schema: z.object({
    cv: z.object({
      id: z.string(),
      url: z.string(),
    }),
    content: z.array(z.string()),
    userId: z.string(),
  }),
  run: async ({ cv, content, userId }) => {
    logger.log("Consolidating markdown from PDF pages", {
      cvUrl: cv.url,
      userId: userId,
    });

    const consolidatedMarkdown = content.join("\n\n---\n\n");

    const markdownBlob = await put(
      `${userId}/cv-${cv.id}-markdown.md`,
      consolidatedMarkdown,
      {
        access: "public",
        contentType: "text/markdown",
        addRandomSuffix: true,
      }
    );

    const result = await dbSocket.transaction(async (tx) => {
      const [newAsset] = await tx
        .insert(assets)
        .values({
          _clerk: userId,
          url: markdownBlob.url,
          pathname: markdownBlob.pathname,
        })
        .returning({ id: assets.id });
      if (!newAsset) {
        throw new Error("Failed to create asset");
      }

      const [newMarkdownAsset] = await tx
        .insert(assetsMarkdown)
        .values({
          _clerk: userId,
          _asset: newAsset.id,
        })
        .returning({ id: assetsMarkdown.id });
      if (!newMarkdownAsset) {
        throw new Error("Failed to create asset markdown");
      }

      const [newPdfMarkdown] = await tx
        .insert(pdfMarkdowns)
        .values({
          _pdf_asset: cv.id,
          _markdown_asset: newMarkdownAsset.id,
        })
        .returning({ id: pdfMarkdowns.id });
      if (!newPdfMarkdown) {
        throw new Error("Failed to create PDF markdown");
      }

      return {
        assetId: newAsset.id,
        markdownAssetId: newMarkdownAsset.id,
        pdfMarkdownId: newPdfMarkdown.id,
        markdownUrl: markdownBlob.url,
      };
    });

    return {
      ...result,
      markdown: consolidatedMarkdown,
    };
  },
});
