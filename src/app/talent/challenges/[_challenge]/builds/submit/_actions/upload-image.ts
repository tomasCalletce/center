"use server";

import { put } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";

export async function uploadImage(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "No logged in user" };
  }

  const file = formData.get("image") as File;

  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image" };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "File size must be less than 5MB" };
  }

  try {
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return {
      success: true,
      blob: {
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
      },
    };
  } catch (error) {
    console.error("Image upload error:", error);
    return { error: "Failed to upload image" };
  }
}
