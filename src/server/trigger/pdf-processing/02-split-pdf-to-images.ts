import { logger, task } from "@trigger.dev/sdk/v3";
import { put } from "@vercel/blob";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

interface SplitPdfPayload {
  pdfUrl: string;
  pdfPath: string;
  fileName: string;
  userId: string;
}

interface SplitPdfResult {
  images: Array<{
    url: string;
    path: string;
    pageNumber: number;
  }>;
  totalPages: number;
  userId: string;
  originalFileName: string;
}

export const splitPdfToImagesTask = task({
  id: "pdf-processing.split-pdf-to-images",
  maxDuration: 600,
  run: async (payload: SplitPdfPayload): Promise<SplitPdfResult> => {
    logger.log("Starting PDF to images conversion using MuPDF", { 
      fileName: payload.fileName, 
      userId: payload.userId 
    });

    // Use UUID for safe temporary file names
    const tempId = randomUUID();
    const pdfPath = `/tmp/${tempId}.pdf`;
    const outputDir = `/tmp/${tempId}_images`;

    try {
      // Download PDF using curl with proper escaping
      logger.log("Downloading PDF", { url: payload.pdfUrl });
      execSync(`curl -s -o "${pdfPath}" "${payload.pdfUrl}"`);

      // Create output directory
      fs.mkdirSync(outputDir, { recursive: true });

      // Convert PDF to images using MuPDF
      logger.log("Converting PDF to images using mutool");
      execSync(`mutool convert -o "${outputDir}/page-%d.png" "${pdfPath}"`);

      // Get list of generated image files
      const imageFiles = fs.readdirSync(outputDir)
        .filter(file => file.endsWith('.png'))
        .sort((a, b) => {
          // Sort by page number
          const matchA = a.match(/page-(\d+)\.png/);
          const matchB = b.match(/page-(\d+)\.png/);
          const pageA = matchA && matchA[1] ? parseInt(matchA[1]) : 0;
          const pageB = matchB && matchB[1] ? parseInt(matchB[1]) : 0;
          return pageA - pageB;
        });

      logger.log(`Generated ${imageFiles.length} image files`);

      const images: Array<{ url: string; path: string; pageNumber: number }> = [];

      // Upload each image to blob storage
      for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];
        if (!imageFile) continue; // Skip if undefined
        
        const pageNumber = i + 1;

        try {
          logger.log(`Processing page ${pageNumber}/${imageFiles.length}`);

          // Read the image file
          const imagePath = path.join(outputDir, imageFile);
          const imageBuffer = fs.readFileSync(imagePath);

          // Upload to blob storage with sanitized filename
          const sanitizedFileName = payload.fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
          const imageName = `${sanitizedFileName.replace('.pdf', '')}_page_${pageNumber}.png`;
          const blob = await put(
            `images/${payload.userId}/${imageName}`, 
            imageBuffer, 
            {
              access: "public",
              contentType: "image/png",
              allowOverwrite: true
            }
          );

          images.push({
            url: blob.url,
            path: blob.pathname,
            pageNumber: pageNumber
          });

          logger.log(`Uploaded page ${pageNumber}`, { url: blob.url });

        } catch (pageError) {
          logger.error(`Failed to process page ${pageNumber}`, { error: pageError });
          // Continue with other pages even if one fails
        }
      }

      logger.log("PDF split completed", { 
        totalPages: images.length,
        userId: payload.userId 
      });

      return {
        images,
        totalPages: images.length,
        userId: payload.userId,
        originalFileName: payload.fileName
      };

    } catch (error) {
      logger.error("Failed to split PDF to images", { error });
      throw new Error(`PDF split failed: ${error}`);

    } finally {
      // Clean up temporary files
      try {
        if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath);
        }
        if (fs.existsSync(outputDir)) {
          fs.rmSync(outputDir, { recursive: true, force: true });
        }
      } catch (cleanupError) {
        logger.warn("Failed to clean up temporary files", { error: cleanupError });
      }
    }
  },
}); 