import fs from "fs";
import path from "path";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { put } from "@vercel/blob";
import { execSync } from "child_process";
import { z } from "zod";
import { dbSocket } from "~/server/db/connection";
import { assets } from "~/server/db/schemas/asset";
import { assetsImages } from "~/server/db/schemas/assets-images";
import { pdfPageImages } from "~/server/db/schemas/pdf_page_images";

export const splitPdfToImagesTask = schemaTask({
  id: "onboarding.split-pdf-to-images",
  schema: z.object({
    cv: z.object({
      id: z.string(),
      url: z.string(),
    }),
    userId: z.string(),
  }),
  run: async ({ cv, userId }) => {
    logger.log("Converting PDF to images", {
      cvId: cv.id,
      userId: userId,
    });

    const pdfPath = `/tmp/${cv.id}.pdf`;
    const outputDir = `/tmp/${cv.id}`;

    execSync(`curl -s -o ${pdfPath} ${cv.url}`);
    fs.mkdirSync(outputDir, { recursive: true });
    execSync(`mutool convert -o ${outputDir}/page-%d.png ${pdfPath}`);

    const result = await dbSocket.transaction(async (tx) => {
      const uploadedUrls = [];
      const processedFiles = [];

      for (const file of fs.readdirSync(outputDir)) {
        if (file.endsWith(".png")) {
          const pageNumber = parseInt(
            file.match(/page-(\d+)\.png/)?.[1] || "0"
          );
          const imageBuffer = fs.readFileSync(path.join(outputDir, file));

          const blob = await put(
            `${userId}/page-${pageNumber}.png`,
            imageBuffer,
            {
              access: "public",
              contentType: "image/png",
              addRandomSuffix: true,
            }
          );

          processedFiles.push({ blob, pageNumber });
        }
      }

      for (const { blob, pageNumber } of processedFiles) {
        const [asset] = await tx
          .insert(assets)
          .values({
            _clerk: userId,
            url: blob.url,
            pathname: blob.pathname,
          })
          .returning({ id: assets.id });
        if (!asset) {
          throw new Error("Failed to create asset");
        }

        const [imageAsset] = await tx
          .insert(assetsImages)
          .values({
            _clerk: userId,
            _asset: asset.id,
            alt: `CV Page ${pageNumber}`,
          })
          .returning({ id: assetsImages.id });
        if (!imageAsset) {
          throw new Error("Failed to create asset image");
        }

        const [pdfPageImage] = await tx
          .insert(pdfPageImages)
          .values({
            _pdf_assets: cv.id,
            _image_asset: imageAsset.id,
            page_number: pageNumber,
          })
          .returning({ id: pdfPageImages.id });
        if (!pdfPageImage) {
          throw new Error("Failed to create pdf page image");
        }

        uploadedUrls.push(blob.url);
      }

      return { imageUrls: uploadedUrls };
    });

    fs.rmSync(outputDir, { recursive: true, force: true });
    fs.unlinkSync(pdfPath);

    return result;
  },
});
