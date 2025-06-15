import { logger, task } from "@trigger.dev/sdk/v3";
import { put } from "@vercel/blob";

interface UploadPdfPayload {
  file: File | Buffer;
  fileName: string;
  userId: string;
}

interface UploadPdfResult {
  pdfUrl: string;
  pdfPath: string;
  fileName: string;
  userId: string;
  uploadedAt: string;
}

export const uploadPdfTask = task({
  id: "pdf-processing.upload-pdf",
  maxDuration: 300,
  run: async (payload: UploadPdfPayload): Promise<UploadPdfResult> => {
    logger.log("Starting PDF upload", { 
      fileName: payload.fileName, 
      userId: payload.userId 
    });

    try {
      const blob = await put(`pdfs/${payload.userId}/${payload.fileName}`, payload.file, {
        access: "public",
        addRandomSuffix: true,
        contentType: "application/pdf"
      });

      logger.log("PDF uploaded successfully", { 
        url: blob.url, 
        pathname: blob.pathname 
      });

      return {
        pdfUrl: blob.url,
        pdfPath: blob.pathname,
        fileName: payload.fileName,
        userId: payload.userId,
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error("Failed to upload PDF", { error });
      throw new Error(`PDF upload failed: ${error}`);
    }
  },
}); 