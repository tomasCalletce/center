import fs from "fs";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { execSync } from "child_process";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";

const cvValidationSchema = z.object({
  isCV: z.boolean(),
  confidence: z.number().min(0).max(1),
  reason: z.string()
});

export const validateCvTask = schemaTask({
  id: "onboarding.validate-cv",
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
    logger.log("Validating if uploaded file is a CV", {
      cvId: cv.id,
      userId: userId,
    });

    const pdfPath = `/tmp/${cv.id}.pdf`;
    const outputDir = `/tmp/${cv.id}`;
    const firstPagePath = `${outputDir}/page-1.png`;

    try {
      execSync(`curl -s -o ${pdfPath} ${cv.url}`);
      fs.mkdirSync(outputDir, { recursive: true });
      execSync(`mutool convert -o ${outputDir}/page-%d.png ${pdfPath} 1`);

      if (!fs.existsSync(firstPagePath)) {
        throw new Error("Failed to extract first page from PDF");
      }

      const imageBuffer = fs.readFileSync(firstPagePath);
      const base64Image = imageBuffer.toString('base64');
      const dataUrl = `data:image/png;base64,${base64Image}`;

      const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: cvValidationSchema,
        temperature: 0.1,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this document and determine if it's a legitimate CV/resume. 

A legitimate CV/resume typically contains:
- Personal information (real name, contact details)
- Professional experience or work history with specific companies and roles
- Education background with actual institutions
- Skills section with relevant technical/professional skills
- Professional summary or objective

RED FLAGS for fake/dummy CVs:
- Placeholder names like "John Doe", "Jane Doe", "Your Name", "First Last"
- Generic company names like "Company Name", "ABC Corp", "XYZ Inc"
- Template text like "Your experience here", "Add your skills"
- Obvious dummy phone numbers like "123-456-7890", "000-000-0000"
- Fake email addresses like "email@example.com", "yourname@email.com"
- Generic job descriptions without specific details
- Unrealistic job titles or experience (e.g., "CEO at multiple companies")
- Inconsistent formatting suggesting it's a template
- Lorem ipsum text or other placeholder content
- Missing crucial details that real CVs would have
- Overly perfect or suspiciously generic content
- Multiple identical job descriptions
- Impossible timelines or overlapping full-time positions
- Skills sections with random unrelated technologies
- Education at fake or non-existent institutions

CRITICAL: If you detect ANY of these red flags, mark it as NOT a legitimate CV.

Return your analysis with:
- isCV: true ONLY if this is clearly a legitimate, real CV/resume
- confidence: 0.0 to 1.0 representing how confident you are
- reason: Brief explanation focusing on why it's real or what red flags you found

Be extremely strict - when in doubt, reject it. Only accept CVs that appear to be genuine professional documents.`
              },
              {
                type: "image",
                image: dataUrl
              }
            ]
          }
        ]
      });

      fs.rmSync(outputDir, { recursive: true, force: true });
      fs.unlinkSync(pdfPath);

      if (!object.isCV) {
        throw new Error(`This document does not appear to be a CV or resume. ${object.reason}. Please upload a valid CV/resume document.`);
      }

      logger.log("CV validation successful", {
        cvId: cv.id,
        userId: userId,
        confidence: object.confidence,
        reason: object.reason
      });

      return {
        isValid: true,
        confidence: object.confidence,
        reason: object.reason
      };

    } catch (error) {
      fs.rmSync(outputDir, { recursive: true, force: true });
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
      throw error;
    }
  },
}); 