"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { api } from "~/trpc/server";
import { documentTypeValues } from "~/server/db/schemas/documents";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { ONBOARDING_STATUS } from "~/types/onboarding";

export async function saveCv(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  const file = formData.get("file") as File;
  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  });
  revalidatePath("/");

  const documentMutation = await api.documents.createCV({
    pathname: blob.pathname,
    type: documentTypeValues.CV,
    content_type: blob.contentType,
  });

  if (!documentMutation) {
    throw new Error("Failed to create document in database.");
  }

  const client = await clerkClient();
  const metadataResponse = await client.users.updateUser(userId, {
    publicMetadata: {
      onboardingStatus: ONBOARDING_STATUS.COMPLETED,
    },
  });

  return {
    blob: blob,
    documentMutation: documentMutation,
    publicMetadata: metadataResponse.publicMetadata,
  };
}
