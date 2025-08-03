import { isAdminAuthedProcedure } from "~/server/api/trpc";
import { assets } from "~/server/db/schemas/asset";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db/connection";
import {
  blogs,
  verifyBlogSchema,
} from "~/server/db/schemas/blogs";
import { assetsImages } from "~/server/db/schemas/assets-images";

export const create = isAdminAuthedProcedure
  .input(verifyBlogSchema)
  .mutation(async ({ input, ctx }) => {
    if (!input.verifyAssetsImageSchema) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Image is required.",
      });
    }

    const [newDocument] = await db
      .insert(assets)
      .values({
        _clerk: ctx.auth.userId,
        pathname: input.verifyAssetsImageSchema.verifyAssetsSchema.pathname,
        url: input.verifyAssetsImageSchema.verifyAssetsSchema.url,
      })
      .returning({ id: assets.id });
    if (!newDocument) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create asset in database.",
      });
    }

    const [newImage] = await db
      .insert(assetsImages)
      .values({
        _clerk: ctx.auth.userId,
        _asset: newDocument.id,
        alt: input.verifyAssetsImageSchema.alt,
      })
      .returning({ id: assetsImages.id });
    if (!newImage) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create image in database.",
      });
    }

    const [newBlog] = await db
      .insert(blogs)
      .values({
        _clerk: ctx.auth.userId,
        _image: newImage.id,
        title: input.title,
        slug: input.slug,
        description: input.description,
        content: input.content,
        author_name: input.author_name,
        author_bio: input.author_bio,
        author_linkedin: input.author_linkedin,
        author_avatar_url: input.author_avatar_url,
        status: input.status,
        published_at: input.status === "PUBLISHED" ? new Date() : null,
      })
      .returning({ id: blogs.id });
    if (!newBlog) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create blog in database.",
      });
    }

    return { id: newBlog.id };
  });