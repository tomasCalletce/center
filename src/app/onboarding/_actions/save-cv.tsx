"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { api } from "~/trpc/server";
import { documentTypeValues } from "~/server/db/schemas/assets-pdf";
import { auth } from "@clerk/nextjs/server";

export async function saveCv(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  const file = formData.get("file") as File;
  const blob = await put(`${userId}/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  revalidatePath("/");

  const documentMutation = await api.asset.pdf.createCV({
    verifyAssetsSchema: {
      pathname: blob.pathname,
      url: blob.url,
    },
    type: documentTypeValues.CV,
  });
  if (!documentMutation) {
    throw new Error("Failed to create document mutation.");
  }

  return {
    blob: blob,
    documentMutation: documentMutation,
  };
}
