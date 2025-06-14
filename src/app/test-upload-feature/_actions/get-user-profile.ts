"use server";

import { db } from "~/server/db/connection";
import { userProfiles } from "~/server/db/schemas/user-profiles";
import { eq } from "drizzle-orm";

const TEST_USER_ID = "user_2yQg3DsQZGcYB1ZiBedp0miD0pT";

export async function getUserProfile() {
  try {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles._user, TEST_USER_ID))
      .limit(1);

    if (!profile) {
      return {
        success: false,
        error: "No profile found for user",
      };
    }

    return {
      success: true,
      profile,
    };
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return {
      success: false,
      error: `Failed to fetch profile: ${error}`,
    };
  }
}

export async function fetchMarkdownContent(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch markdown: ${response.statusText}`);
    }
    const content = await response.text();
    return {
      success: true,
      content,
    };
  } catch (error) {
    console.error("Failed to fetch markdown content:", error);
    return {
      success: false,
      error: `Failed to fetch markdown: ${error}`,
      content: "",
    };
  }
} 