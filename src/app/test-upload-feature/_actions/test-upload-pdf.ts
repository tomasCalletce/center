"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { tasks } from "@trigger.dev/sdk/v3";
import type { pdfProcessingOrchestratorTask } from "~/server/trigger/pdf-processing";

const TEST_USER_ID = "user_2yQg3DsQZGcYB1ZiBedp0miD0pT";

export async function testUploadPdf(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    
    if (!file) {
      throw new Error("No file provided");
    }

    if (file.type !== "application/pdf") {
      throw new Error("File must be a PDF");
    }

    console.log(`🧪 Test Upload - Starting PDF processing for: ${file.name}`);

    // Convert File to Buffer for proper serialization through Trigger.dev
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    console.log(`📄 File converted to buffer (${fileBuffer.length} bytes)`);

    // Upload to blob storage
    const blob = await put(`test-uploads/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: "application/pdf"
    });

    console.log(`📄 PDF uploaded to: ${blob.url}`);

    // Trigger PDF processing workflow and wait for completion
    try {
      console.log(`🚀 Triggering workflow for user: ${TEST_USER_ID}`);
      
      const result = await tasks.triggerAndPoll<typeof pdfProcessingOrchestratorTask>(
        "pdf-processing.orchestrator",
        {
          file: fileBuffer, // Pass Buffer instead of File
          fileName: file.name,
          userId: TEST_USER_ID,
        },
        {
          pollIntervalMs: 2000, // Poll every 2 seconds
        }
      );

      console.log(`✅ Workflow completed:`, result);

      // Check if the workflow was successful based on result status
      if (result.status === "COMPLETED" && result.output) {
        return {
          success: result.output.success || false,
          pdfUrl: result.output.pdfUrl || blob.url,
          markdownUrl: result.output.markdownUrl,
          profileId: result.output.profileId,
          totalPages: result.output.totalPages,
          fieldsExtracted: result.output.fieldsExtracted,
          processingTime: result.output.processingTime,
          stages: result.output.stages || {
            upload: { status: 'success' as const },
            split: { status: 'failed' as const },
            llmProcessing: { status: 'failed' as const },
            markdownGeneration: { status: 'failed' as const },
            jsonExtraction: { status: 'failed' as const },
            profileUpdate: { status: 'failed' as const }
          },
          error: result.output.error,
          workflowId: result.id,
          testUserId: TEST_USER_ID
        };
      } else {
        // Workflow failed or didn't complete
        console.error(`❌ Workflow failed or didn't complete:`, result);
        return {
          success: false,
          error: `Workflow status: ${result.status}. ${result.error || 'Unknown error'}`,
          workflowId: result.id,
          testUserId: TEST_USER_ID,
          pdfUrl: blob.url,
          stages: {
            upload: { status: 'success' as const, message: 'PDF uploaded successfully' },
            split: { status: 'failed' as const, message: 'Workflow execution failed' },
            llmProcessing: { status: 'failed' as const },
            markdownGeneration: { status: 'failed' as const },
            jsonExtraction: { status: 'failed' as const },
            profileUpdate: { status: 'failed' as const }
          }
        };
      }

    } catch (workflowError) {
      console.error(`❌ Workflow execution failed:`, workflowError);
      
      // Return partial success with workflow info
      return {
        success: false,
        error: `Workflow execution failed: ${workflowError}`,
        testUserId: TEST_USER_ID,
        pdfUrl: blob.url,
        stages: {
          upload: { status: 'success' as const, message: 'PDF uploaded successfully' },
          split: { status: 'failed' as const, message: 'Workflow execution failed' },
          llmProcessing: { status: 'failed' as const },
          markdownGeneration: { status: 'failed' as const },
          jsonExtraction: { status: 'failed' as const },
          profileUpdate: { status: 'failed' as const }
        }
      };
    }

  } catch (error) {
    console.error("❌ Test upload failed:", error);
    
    return {
      success: false,
      error: `Upload failed: ${error}`,
      stages: {
        upload: { status: 'failed' as const, message: `Upload failed: ${error}` },
        split: { status: 'failed' as const },
        llmProcessing: { status: 'failed' as const },
        markdownGeneration: { status: 'failed' as const },
        jsonExtraction: { status: 'failed' as const },
        profileUpdate: { status: 'failed' as const }
      }
    };
  }
} 