import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "ACC - Competition Based Hiring",
  description:
    "Revolutionizing recruitment through competition-based hiring. Find the best talent through skills-based evaluation.",
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
          <body>{children}</body>
        </TRPCReactProvider>
      </ClerkProvider>
    </html>
  );
}
