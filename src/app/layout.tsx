import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: "ACC - Show Your Skills, Ship Your Ideas",
  description: "Let’s Accelerate the future from Latin America",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <ClerkProvider>
        <TRPCReactProvider>
          <NuqsAdapter>
            <body>{children}</body>
          </NuqsAdapter>
        </TRPCReactProvider>
      </ClerkProvider>
    </html>
  );
}
