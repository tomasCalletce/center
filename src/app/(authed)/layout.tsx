import { Toaster } from "~/components/ui/sonner";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/ui/app-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-auto px-6 py-4">
        {children}
        <Toaster />
      </main>
    </SidebarProvider>
  );
}
