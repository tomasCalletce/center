"use server";

import { auth } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";
import { revalidatePath } from "next/cache";

export async function updateProfileSkills(skills: string[]) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "No logged in user" };
  }

  try {
    await api.user.updateProfile({
      skills: skills,
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update skills:", error);
    return { error: "Failed to update skills" };
  }
}

export async function updateProfileExperience(experience: any[]) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "No logged in user" };
  }

  try {
    await api.user.updateProfile({
      experience: experience,
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update experience:", error);
    return { error: "Failed to update experience" };
  }
}

export async function updateProfileEducation(education: any[]) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "No logged in user" };
  }

  try {
    await api.user.updateProfile({
      education: education,
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update education:", error);
    return { error: "Failed to update education" };
  }
}

export async function updateProfileHeader(data: {
  display_name?: string;
  location?: string;
  current_title?: string;
  social_links?: Array<{ platform: "linkedin" | "github" | "portfolio" | "website"; url: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "No logged in user" };
  }

  try {
    await api.user.updateProfile(data);

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile header:", error);
    return { error: "Failed to update profile header" };
  }
} 