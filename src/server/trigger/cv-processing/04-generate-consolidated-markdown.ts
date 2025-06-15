import { logger, task } from "@trigger.dev/sdk/v3";
import { put } from "@vercel/blob";

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

interface GenerateMarkdownPayload {
  processedImages: ProcessedImage[];
  userId: string;
  originalFileName: string;
  totalProcessed: number;
}

interface ConsolidatedMarkdown {
  content: string;
  metadata: {
    originalFileName: string;
    userId: string;
    totalPages: number;
    processedAt: string;
    averageConfidence: number;
    allElements: string[];
    pageBreakdown: Array<{
      pageNumber: number;
      confidence: number;
      elements: string[];
      contentLength: number;
    }>;
  };
}

interface GenerateMarkdownResult {
  markdownUrl: string;
  markdownPath: string;
  consolidatedMarkdown: ConsolidatedMarkdown;
  userId: string;
}

export const generateConsolidatedMarkdownTask = task({
  id: "pdf-processing.generate-consolidated-markdown",
  maxDuration: 300,
  run: async (
    payload: GenerateMarkdownPayload
  ): Promise<GenerateMarkdownResult> => {
    logger.log("Starting consolidated markdown generation", {
      totalPages: payload.totalProcessed,
      userId: payload.userId,
    });

    try {
      // Sort images by page number
      const sortedImages = payload.processedImages.sort(
        (a, b) => a.pageNumber - b.pageNumber
      );

      // Generate consolidated content
      let consolidatedContent = `# ${payload.originalFileName.replace(
        ".pdf",
        ""
      )} - Document Analysis\n\n`;

      // Add document metadata section
      const allElements = [
        ...new Set(sortedImages.flatMap((img) => img.metadata.elements)),
      ];
      const averageConfidence =
        sortedImages.reduce((sum, img) => sum + img.metadata.confidence, 0) /
        sortedImages.length;

      consolidatedContent += `## Document Overview\n\n`;
      consolidatedContent += `- **Original File**: ${payload.originalFileName}\n`;
      consolidatedContent += `- **Total Pages**: ${payload.totalProcessed}\n`;
      consolidatedContent += `- **Processed At**: ${new Date().toISOString()}\n`;
      consolidatedContent += `- **Average Confidence**: ${(
        averageConfidence * 100
      ).toFixed(1)}%\n`;
      consolidatedContent += `- **Detected Elements**: ${allElements.join(
        ", "
      )}\n\n`;

      // Add table of contents
      consolidatedContent += `## Table of Contents\n\n`;
      for (const image of sortedImages) {
        consolidatedContent += `- [Page ${image.pageNumber}](#page-${image.pageNumber})\n`;
      }
      consolidatedContent += `\n---\n\n`;

      // Add content from each page
      for (const image of sortedImages) {
        consolidatedContent += `## Page ${image.pageNumber}\n\n`;
        consolidatedContent += `**Confidence**: ${(
          image.metadata.confidence * 100
        ).toFixed(1)}%  \n`;
        consolidatedContent += `**Elements Found**: ${
          image.metadata.elements.join(", ") || "None"
        }  \n`;
        consolidatedContent += `**Source Image**: [View Image](${image.imageUrl})\n\n`;
        consolidatedContent += `${image.extractedText}\n\n`;
        consolidatedContent += `---\n\n`;
      }

      // Add processing summary
      consolidatedContent += `## Processing Summary\n\n`;
      consolidatedContent += `- **Successfully Processed**: ${
        sortedImages.filter((img) => img.metadata.confidence > 0).length
      } pages\n`;
      consolidatedContent += `- **Failed Processing**: ${
        sortedImages.filter((img) => img.metadata.confidence === 0).length
      } pages\n`;
      consolidatedContent += `- **Total Elements Detected**: ${allElements.length}\n`;
      consolidatedContent += `- **Processing Completed**: ${new Date().toISOString()}\n\n`;

      // Create metadata object
      const metadata: ConsolidatedMarkdown["metadata"] = {
        originalFileName: payload.originalFileName,
        userId: payload.userId,
        totalPages: payload.totalProcessed,
        processedAt: new Date().toISOString(),
        averageConfidence,
        allElements,
        pageBreakdown: sortedImages.map((img) => ({
          pageNumber: img.pageNumber,
          confidence: img.metadata.confidence,
          elements: img.metadata.elements,
          contentLength: img.extractedText.length,
        })),
      };

      const consolidatedMarkdown: ConsolidatedMarkdown = {
        content: consolidatedContent,
        metadata,
      };

      // Upload consolidated markdown to blob storage
      const markdownFileName = `${payload.originalFileName.replace(
        ".pdf",
        ""
      )}_consolidated.md`;
      const blob = await put(
        `markdown/${payload.userId}/${markdownFileName}`,
        consolidatedContent,
        {
          access: "public",
          contentType: "text/markdown",
          allowOverwrite: true,
        }
      );

      logger.log("Consolidated markdown generated and uploaded", {
        url: blob.url,
        contentLength: consolidatedContent.length,
        totalPages: payload.totalProcessed,
      });

      return {
        markdownUrl: blob.url,
        markdownPath: blob.pathname,
        consolidatedMarkdown,
        userId: payload.userId,
      };
    } catch (error) {
      logger.error("Failed to generate consolidated markdown", { error });
      throw new Error(`Markdown generation failed: ${error}`);
    }
  },
});
