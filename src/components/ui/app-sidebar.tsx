"use client";

import * as React from "react";
import {
  Trophy,
  LayoutDashboard,
  Search,
  User,
  Settings,
  FileText,
  Target,
  Bookmark,
} from "lucide-react";
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
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Challenges",
      url: "/challenges",
      icon: Target,
      items: [
        {
          title: "Browse All",
          url: "/challenges",
        },
        {
          title: "Active",
          url: "/challenges/active",
        },
        {
          title: "Completed",
          url: "/challenges/completed",
        },
        {
          title: "Saved",
          url: "/challenges/saved",
        },
      ],
    },
    {
      title: "Leaderboard",
      url: "/leaderboard",
      icon: Trophy,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: User,
      items: [
        {
          title: "Overview",
          url: "/profile",
        },
        {
          title: "Resume",
          url: "/profile/resume",
        },
        {
          title: "Skills",
          url: "/profile/skills",
        },
        {
          title: "Achievements",
          url: "/profile/achievements",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "Account",
          url: "/settings/account",
        },
        {
          title: "Notifications",
          url: "/settings/notifications",
        },
        {
          title: "Privacy",
          url: "/settings/privacy",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="px-2 py-2">
          <h2 className="text-xl font-bold">
            ACC<span className="text-primary">.</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Talent Platform</p>
        </div>
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
