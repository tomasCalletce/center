import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export const imageToMarkdownTask = schemaTask({
  id: "onboarding.image-to-markdown",
  schema: z.object({
    image: z.object({
      url: z.string(),
    }),
    userId: z.string(),
  }),
  run: async ({ image, userId }) => {
    logger.log("Converting PDF to images", {
      imageUrl: image.url,
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

    return {
      markdown: text,
    };
  },
});
