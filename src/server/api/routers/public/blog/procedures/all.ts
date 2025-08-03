import { publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/connection";
import { blogs } from "~/server/db/schemas/blogs";
import { assetsImages } from "~/server/db/schemas/assets-images";
import { assets } from "~/server/db/schemas/asset";
import { eq, desc } from "drizzle-orm";

export const all = publicProcedure.query(async () => {
  const result = await db
    .select({
      id: blogs.id,
      title: blogs.title,
      slug: blogs.slug,
      description: blogs.description,
      author_name: blogs.author_name,
      author_bio: blogs.author_bio,
      author_linkedin: blogs.author_linkedin,
      author_avatar_url: blogs.author_avatar_url,
      published_at: blogs.published_at,
      image_url: assets.url,
    })
    .from(blogs)
    .leftJoin(assetsImages, eq(blogs._image, assetsImages.id))
    .leftJoin(assets, eq(assetsImages._asset, assets.id))
    .where(eq(blogs.status, "PUBLISHED"))
    .orderBy(desc(blogs.published_at));

  return result;
});