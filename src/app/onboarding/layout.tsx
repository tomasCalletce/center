import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen w-full">
      <div className="flex min-h-screen w-1/2 bg-gradient-to-b from-zinc-800 to-zinc-950"></div>
      <div className="flex min-h-screen w-1/2 bg-white">{children}</div>
    </main>
  );
}
