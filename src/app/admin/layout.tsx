import { Toaster } from "~/components/ui/sonner";
import { SidebarProvider } from "~/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <main className="flex-1 overflow-auto px-6 py-4">
        {children}
        <Toaster />
      </main>
    </SidebarProvider>
  );
}
