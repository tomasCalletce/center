import { protectedProcedure } from "~/server/api/trpc";
import { verifyDocumentsSchema } from "~/server/db";
import { documents } from "~/server/db/schemas/documents";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db/connection";

const CV_PDF_TO_MARKDOWN_PROMPT = `
Extract ALL information from this CV/resume as clean markdown. The CV may be in Spanish or English. Extract everything exactly as it appears do not modify, translate, or interpret any content. Keep all original text, dates, names, descriptions, and formatting exactly as written.

Instructions:
- Extract EVERYTHING from the document
- Copy all text exactly as it appears in the original document
- Do not translate anything
- Do not modify dates, names, descriptions, or any other content
- Preserve the original structure and organization
- Include all sections: personal info, contact details, experience, education, skills, certifications, projects, languages, references, etc.
- Keep original formatting, bullet points, and line breaks where possible
- If there are tables, lists, or special formatting, preserve the structure in markdown
- Extract every piece of text - leave nothing out

Output everything as clean, readable markdown that captures the complete content of the CV.
`;

export const createCV = protectedProcedure
  .input(verifyDocumentsSchema)
  .mutation(async ({ input, ctx }) => {
    const [newCV] = await db
      .insert(documents)
      .values({
        _clerk: ctx.auth.userId,
        pathname: input.pathname,
        url: input.url,
        type: input.type,
        content_type: input.content_type,
      })
      .returning({ id: documents.id });
    if (!newCV) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create document in database.",
      });
    }

    console.log("url", input.url);

    // const result = await generateText({
    //   model: anthropic("claude-3-5-sonnet-20250110"),
    //   messages: [
    //     {
    //       role: "user",
    //       content: [
    //         {
    //           type: "text",
    //           text: CV_PDF_TO_MARKDOWN_PROMPT,
    //         },
    //         {
    //           type: "file",
    //           data: new URL(input.url),
    //           mimeType: input.content_type,
    //         },
    //       ],
    //     },
    //   ],
    // });

    // const timestamp = new Date().toISOString().split("T")[0];
    // const blobKey = `cv-extracts/${timestamp}-${newCV.id}.md`;
    // const blob = await put(blobKey, result.text, {
    //   access: "public",
    //   contentType: "text/markdown",
    // });

    return {
      document: newCV,
      blob: undefined,
    };
  });
