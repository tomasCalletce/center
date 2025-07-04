import { Toaster } from "~/components/ui/sonner";
import { Header } from "~/app/(top-header)/_components/header";
import { Footer } from "~/app/(top-header)/_components/footer";
import { HelpChatButton } from "~/components/help-chat-button";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 max-w-screen-2xl px-4">
        {children}
        <Toaster />
      </main>
      <Footer />
      <HelpChatButton />
    </div>
  );
}
