"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding = async (formData: {
  user: { name: string };
}) => {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  const client = await clerkClient();

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        name: formData.user.name,
      },
    });
    return { message: res.publicMetadata };
  } catch {
    return { error: "There was an error updating the user metadata." };
  }
};
