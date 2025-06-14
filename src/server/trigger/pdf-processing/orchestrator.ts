import { logger, task } from "@trigger.dev/sdk/v3";
import { uploadPdfTask } from "./01-upload-pdf";
import { splitPdfToImagesTask } from "./02-split-pdf-to-images";
import { processImagesWithLlmTask } from "./03-process-images-with-llm";
import { generateConsolidatedMarkdownTask } from "./04-generate-consolidated-markdown";
import { extractJsonStructureTask } from "./05-extract-json-structure";
import { updateUserProfilesTask } from "./06-update-user-profiles";

interface PdfProcessingOrchestratorPayload {
  file: File | Buffer;
  fileName: string;
  userId: string;
}

interface PdfProcessingResult {
  success: boolean;
  pdfUrl?: string;
  markdownUrl?: string;
  profileId?: string;
  totalPages?: number;
  fieldsExtracted?: string[];
  processingTime?: number;
  stages: {
    upload: { status: 'success' | 'failed'; message?: string };
    split: { status: 'success' | 'failed'; message?: string; totalPages?: number };
    llmProcessing: { status: 'success' | 'failed'; message?: string; pagesProcessed?: number };
    markdownGeneration: { status: 'success' | 'failed'; message?: string; markdownUrl?: string };
    jsonExtraction: { status: 'success' | 'failed'; message?: string; fieldsExtracted?: number };
    profileUpdate: { status: 'success' | 'failed'; message?: string; profileId?: string };
  };
  error?: string;
}

export const pdfProcessingOrchestratorTask = task({
  id: "pdf-processing.orchestrator",
  maxDuration: 3600, // 1 hour for the entire workflow
  run: async (payload: PdfProcessingOrchestratorPayload): Promise<PdfProcessingResult> => {
    const startTime = Date.now();
    
    logger.log("Starting PDF processing workflow", { 
      fileName: payload.fileName,
      userId: payload.userId
    });

    const result: PdfProcessingResult = {
      success: false,
      stages: {
        upload: { status: 'failed' },
        split: { status: 'failed' },
        llmProcessing: { status: 'failed' },
        markdownGeneration: { status: 'failed' },
        jsonExtraction: { status: 'failed' },
        profileUpdate: { status: 'failed' }
      }
    };

    try {
      // Stage 1: Upload PDF
      logger.log("Stage 1: Uploading PDF");
      const uploadResult = await uploadPdfTask.triggerAndWait({
        file: payload.file,
        fileName: payload.fileName,
        userId: payload.userId
      });

      if (!uploadResult.ok) {
        result.stages.upload = { status: 'failed', message: 'Upload task failed' };
        result.error = 'PDF upload failed';
        return result;
      }

      result.stages.upload = { status: 'success', message: 'PDF uploaded successfully' };
      result.pdfUrl = uploadResult.output.pdfUrl;

      // Stage 2: Split PDF to Images
      logger.log("Stage 2: Splitting PDF to images");
      const splitResult = await splitPdfToImagesTask.triggerAndWait({
        pdfUrl: uploadResult.output.pdfUrl,
        pdfPath: uploadResult.output.pdfPath,
        fileName: uploadResult.output.fileName,
        userId: uploadResult.output.userId
      });

      if (!splitResult.ok) {
        result.stages.split = { status: 'failed', message: 'PDF split failed' };
        result.error = 'PDF to images conversion failed';
        return result;
      }

      result.stages.split = { 
        status: 'success', 
        message: 'PDF split successfully',
        totalPages: splitResult.output.totalPages 
      };
      result.totalPages = splitResult.output.totalPages;

      // Stage 3: Process Images with LLM
      logger.log("Stage 3: Processing images with LLM");
      const llmResult = await processImagesWithLlmTask.triggerAndWait({
        images: splitResult.output.images,
        userId: splitResult.output.userId,
        originalFileName: splitResult.output.originalFileName
      });

      if (!llmResult.ok) {
        result.stages.llmProcessing = { status: 'failed', message: 'LLM processing failed' };
        result.error = 'LLM image processing failed';
        return result;
      }

      result.stages.llmProcessing = { 
        status: 'success', 
        message: 'Images processed successfully',
        pagesProcessed: llmResult.output.totalProcessed 
      };

      // Stage 4: Generate Consolidated Markdown
      logger.log("Stage 4: Generating consolidated markdown");
      const markdownResult = await generateConsolidatedMarkdownTask.triggerAndWait({
        processedImages: llmResult.output.processedImages,
        userId: llmResult.output.userId,
        originalFileName: llmResult.output.originalFileName,
        totalProcessed: llmResult.output.totalProcessed
      });

      if (!markdownResult.ok) {
        result.stages.markdownGeneration = { status: 'failed', message: 'Markdown generation failed' };
        result.error = 'Consolidated markdown generation failed';
        return result;
      }

      result.stages.markdownGeneration = { 
        status: 'success', 
        message: 'Markdown generated successfully',
        markdownUrl: markdownResult.output.markdownUrl 
      };
      result.markdownUrl = markdownResult.output.markdownUrl;

      // Stage 5: Extract JSON Structure
      logger.log("Stage 5: Extracting JSON structure");
      const jsonResult = await extractJsonStructureTask.triggerAndWait({
        markdownUrl: markdownResult.output.markdownUrl,
        markdownPath: markdownResult.output.markdownPath,
        consolidatedMarkdown: markdownResult.output.consolidatedMarkdown,
        userId: markdownResult.output.userId
      });

      if (!jsonResult.ok) {
        result.stages.jsonExtraction = { status: 'failed', message: 'JSON extraction failed' };
        result.error = 'JSON structure extraction failed';
        return result;
      }

      result.stages.jsonExtraction = { 
        status: 'success', 
        message: 'JSON extracted successfully',
        fieldsExtracted: jsonResult.output.extractionMetadata.fieldsExtracted.length 
      };
      result.fieldsExtracted = jsonResult.output.extractionMetadata.fieldsExtracted;

      // Stage 6: Update User Profiles
      logger.log("Stage 6: Updating user profiles");
      const profileResult = await updateUserProfilesTask.triggerAndWait({
        userProfileData: jsonResult.output.userProfileData,
        extractionMetadata: jsonResult.output.extractionMetadata
      });

      if (!profileResult.ok) {
        result.stages.profileUpdate = { status: 'failed', message: 'Profile update failed' };
        result.error = 'User profile update failed';
        return result;
      }

      result.stages.profileUpdate = { 
        status: 'success', 
        message: 'Profile updated successfully',
        profileId: profileResult.output.profileId 
      };
      result.profileId = profileResult.output.profileId;

      // Calculate processing time
      const endTime = Date.now();
      result.processingTime = Math.round((endTime - startTime) / 1000); // seconds

      result.success = true;

      logger.log("PDF processing workflow completed successfully", {
        userId: payload.userId,
        fileName: payload.fileName,
        totalPages: result.totalPages,
        fieldsExtracted: result.fieldsExtracted?.length,
        processingTime: result.processingTime,
        profileId: result.profileId
      });

      return result;

    } catch (error) {
      logger.error("PDF processing workflow failed", { error });
      result.error = `Workflow failed: ${error}`;
      result.processingTime = Math.round((Date.now() - startTime) / 1000);
      return result;
    }
  },
}); 