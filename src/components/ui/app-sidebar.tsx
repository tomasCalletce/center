"use client";

import Link from "next/link";
import { LayoutDashboard, User, List } from "lucide-react";
import { NavMain } from "~/components/ui/nav-main";
import { NavUser } from "~/components/ui/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/talent/",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Submissions",
      url: "/talent/submissions",
      icon: List,
      isActive: true,
    },
    {
      title: "Profile",
      url: "/talent/profile",
      icon: User,
      items: [
        {
          title: "Overview",
          url: "/talent/profile",
        },
        {
          title: "Resume",
          url: "/talent/profile/resume",
        },
        {
          title: "Skills",
          url: "/talent/profile/skills",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/talent" className="px-2 py-2">
          <h2 className="text-xl font-bold">
            ACC<span className="text-primary">.</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Talent Platform</p>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
