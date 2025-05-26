import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ONBOARDING_STATUS } from "~/types/onboarding";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (
    (await auth()).sessionClaims?.metadata?.onboardingStatus ===
    ONBOARDING_STATUS.COMPLETED
  ) {
    redirect("/");
  }

  return children;
}
