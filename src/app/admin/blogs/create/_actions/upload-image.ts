"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function uploadBlogImage(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "No logged in user" };
  }

  const file = formData.get("image") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "Please select a valid image file" };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "Image must be less than 5MB" };
  }

  try {
    const blob = await put(`blogs/${userId}/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    revalidatePath("/admin/blogs");

    return {
      success: true,
      blob: {
        url: blob.url,
        pathname: blob.pathname,
        alt: file.name,
      },
    };
  } catch (error) {
    console.error("Failed to upload image:", error);
    return { error: "Failed to upload image" };
  }
}