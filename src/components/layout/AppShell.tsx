
import { useState } from "react";
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppNavigation } from "./AppNavigation";
import { Header } from "./Header";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarProvider defaultCollapsed={false}>
      <div className="min-h-screen bg-health-background flex w-full">
        <Sidebar className="border-r border-gray-200">
          <SidebarContent>
            <AppNavigation />
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
