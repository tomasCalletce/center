import fs from "fs";
import path from "path";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { put } from "@vercel/blob";
import { execSync } from "child_process";
import { z } from "zod";

export const splitPdfToImagesTask = schemaTask({
  id: "split-pdf-to-images",
  maxDuration: 600,
  schema: z.object({
    cv: z.object({
      id: z.string(),
      url: z.string(),
    }),
    pathDestination: z.string(),
  }),
  run: async ({ cv, pathDestination }) => {
    logger.log("Starting PDF to images conversion", {
      cvId: cv.id,
      cvUrl: cv.url,
    });
    const documentId = cv.id;
    const pdfPath = `/tmp/${documentId}.pdf`;
    const outputDir = `/tmp/${documentId}`;

    execSync(`curl -s -o ${pdfPath} "${cv.url}"`);

    fs.mkdirSync(outputDir, { recursive: true });

    execSync(`mutool convert -o ${outputDir}/page-%d.png ${pdfPath}`);

    const images = [];
    const files = fs.readdirSync(outputDir).sort();

    for (const file of files) {
      if (file.endsWith(".png")) {
        const pageNumber = parseInt(file.match(/page-(\d+)\.png/)?.[1] || "0");
        const imageBuffer = fs.readFileSync(path.join(outputDir, file));

        const blob = await put(
          `${pathDestination}/page-${pageNumber}.png`,
          imageBuffer,
          {
            access: "public",
            contentType: "image/png",
          }
        );

        images.push({
          url: blob.url,
          path: blob.pathname,
          pageNumber: pageNumber,
        });
      }
    }

    fs.rmSync(outputDir, { recursive: true, force: true });
    fs.unlinkSync(pdfPath);

    return {
      images,
      totalPages: images.length,
      originalFileName: cv.id,
    };
  },
});
