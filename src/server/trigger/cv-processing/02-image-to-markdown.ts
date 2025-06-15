import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { put } from "@vercel/blob";
import { dbSocket } from "~/server/db/connection";
import { assetsMarkdown } from "~/server/db/schemas/asset-markdown";
import { assets } from "~/server/db/schemas/asset";
import { imageMarkdowns } from "~/server/db/schemas/image-markdowns";

export const imageToMarkdownTask = schemaTask({
  id: "onboarding.image-to-markdown",
  schema: z.object({
    image: z.object({
      id: z.string(),
      url: z.string(),
      pageNumber: z.number(),
    }),
    userId: z.string(),
  }),
  run: async ({ image, userId }) => {
    logger.log("Converting PDF to images", {
      imageId: image.id,
      userId: userId,
    });

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract all text from this image and format it as clean markdown.
              
              Instructions:
              - Use proper markdown formatting (headers, lists, tables, etc.)
              - Preserve the original structure and layout
              - Be thorough and accurate
              - If it's a table, format as markdown table
              - If it's a list, format as markdown list
              - Use appropriate heading levels
              
              Return only the markdown content, no explanations.`,
            },
            {
              type: "image",
              image: image.url,
            },
          ],
        },
      ],
      maxTokens: 4000,
      temperature: 0.1,
    });

    const markdownBlob = await put(
      `${userId}/page-${image.pageNumber}-markdown.md`,
      text,
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

      const [newImageMarkdown] = await tx
        .insert(imageMarkdowns)
        .values({
          _image_asset: image.id,
          _markdown_asset: newMarkdownAsset.id,
        })
        .returning({ id: imageMarkdowns.id });

      if (!newImageMarkdown) {
        throw new Error("Failed to create image markdown");
      }

      return {
        assetId: newAsset.id,
        markdownAssetId: newMarkdownAsset.id,
        imageMarkdownId: newImageMarkdown.id,
        markdownUrl: markdownBlob.url,
      };
    });

    return result;
  },
});
