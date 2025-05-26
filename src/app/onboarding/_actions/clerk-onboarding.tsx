"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { ONBOARDING_STATUS } from "~/types/onboarding";

interface OnboardingFormData {
  onboardingStatus: ONBOARDING_STATUS;
}

export const completeOnboarding = async (formData: OnboardingFormData) => {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  const client = await clerkClient();

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingStatus: formData.onboardingStatus,
      },
    });
    return { message: res.publicMetadata };
  } catch {
    return { error: "There was an error updating the user metadata." };
  }
};
