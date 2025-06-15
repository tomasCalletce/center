import { logger, task } from "@trigger.dev/sdk/v3";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

interface ProcessImagesPayload {
  images: Array<{
    url: string;
    path: string;
    pageNumber: number;
  }>;
  userId: string;
  originalFileName: string;
}

interface ProcessedImage {
  pageNumber: number;
  imageUrl: string;
  extractedText: string;
  markdownContent: string;
  metadata: {
    confidence: number;
    elements: string[];
    timestamp: string;
  };
}

interface ProcessImagesResult {
  processedImages: ProcessedImage[];
  userId: string;
  originalFileName: string;
  totalProcessed: number;
}

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const processImagesWithLlmTask = task({
  id: "pdf-processing.process-images-with-llm",
  maxDuration: 1800, // 30 minutes for multiple images
  run: async (payload: ProcessImagesPayload): Promise<ProcessImagesResult> => {
    logger.log("Starting LLM image processing", { 
      totalImages: payload.images.length,
      userId: payload.userId 
    });

    // Process images in parallel batches to avoid rate limits
    const BATCH_SIZE = 5; // Adjust based on your OpenAI rate limits
    const processedImages: ProcessedImage[] = [];

    const processImage = async (image: typeof payload.images[0]): Promise<ProcessedImage> => {
      try {
        logger.log(`Processing page ${image.pageNumber}`, { 
          imageUrl: image.url 
        });

        const { text: extractedContent, finishReason } = await generateText({
          model: openai("gpt-4o-mini"), // Faster and cheaper than gpt-4.1-nano
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Extract all text and information from this image. 
                  Format the output as clean markdown with proper structure.
                  Include headers, lists, tables, and any other relevant formatting.
                  Also identify key elements like: titles, names, dates, addresses, phone numbers, emails, etc.
                  Be thorough and maintain the original structure as much as possible.
                  If the image is a table, extract the data from the table.
                  If the image is a list, extract the list items.
                  If the image is a paragraph, extract the text from the paragraph.
                  If the image is a heading, extract the text from the heading.
                  If the image is a subheading, extract the text from the subheading.
                  If the image is a list item, extract the text from the list item.
                  Important: Use Markdown formatting for the output.
                  `
                },
                {
                  type: "image",
                  image: image.url
                }
              ]
            }
          ],
          maxTokens: 4000,
          temperature: 0.1
        });
        
        // Extract metadata from the content
        const elements = (extractedContent.match(/\b(?:email|phone|address|name|date|title)\b/gi) || []) as string[];
        
        const processedImage: ProcessedImage = {
          pageNumber: image.pageNumber,
          imageUrl: image.url,
          extractedText: extractedContent,
          markdownContent: `# Page ${image.pageNumber}\n\n${extractedContent}`,
          metadata: {
            confidence: finishReason === "stop" ? 0.9 : 0.7,
            elements: [...new Set(elements)],
            timestamp: new Date().toISOString()
          }
        };

        logger.log(`Completed processing page ${image.pageNumber}`, {
          contentLength: extractedContent.length,
          elementsFound: elements.length
        });

        return processedImage;

      } catch (error) {
        logger.error(`Failed to process page ${image.pageNumber}`, { error });
        return {
          pageNumber: image.pageNumber,
          imageUrl: image.url,
          extractedText: `Error processing page ${image.pageNumber}: ${error}`,
          markdownContent: `# Page ${image.pageNumber}\n\n*Error processing this page*`,
          metadata: {
            confidence: 0.0,
            elements: [],
            timestamp: new Date().toISOString()
          }
        };
      }
    };

    // Process images in batches
    for (let i = 0; i < payload.images.length; i += BATCH_SIZE) {
      const batch = payload.images.slice(i, i + BATCH_SIZE);
      if (batch.length === 0) continue;
      
      logger.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}`, { 
        batchSize: batch.length,
        startPage: batch[0]!.pageNumber,
        endPage: batch[batch.length - 1]!.pageNumber
      });

      // Process all images in this batch concurrently
      const batchResults = await Promise.allSettled(
        batch.map(image => processImage(image))
      );

      // Extract successful results
      const batchProcessedImages = batchResults
        .filter((result): result is PromiseFulfilledResult<ProcessedImage> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value);

      processedImages.push(...batchProcessedImages);

      // Small delay between batches to be respectful to rate limits
      if (i + BATCH_SIZE < payload.images.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Sort by page number to maintain order
    processedImages.sort((a, b) => a.pageNumber - b.pageNumber);

    logger.log("LLM processing completed", { 
      totalProcessed: processedImages.length,
      successfullyProcessed: processedImages.filter(p => p.metadata.confidence > 0).length
    });

    return {
      processedImages,
      userId: payload.userId,
      originalFileName: payload.originalFileName,
      totalProcessed: processedImages.length
    };
  },
}); 