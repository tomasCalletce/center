"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { UserMenu } from "./user-menu";
import { Home, User } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isProfilePage = pathname === "/profile";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center px-4">
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <span className="text-2xl font-bold italic">
            ACC<span className="text-slate-900">.</span>
          </span>
        </Link>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/">
                <Button
                  variant="ghost"
                  className={`cursor-pointer flex items-center gap-2 ${isHomePage ? "border-b-2 border-slate-900 rounded-t-md rounded-b-none" : ""}`}
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
            </NavigationMenuItem>
            <SignedIn>
              <NavigationMenuItem>
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    className={`cursor-pointer flex items-center gap-2 ${isProfilePage ? "border-b-2 border-slate-900 rounded-t-md rounded-b-none" : ""}`}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
              </NavigationMenuItem>
            </SignedIn>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <SignedIn>
            <UserMenu />
          </SignedIn>
          <SignedOut>
            <nav className="flex items-center gap-3">
              <SignUpButton>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-4 text-sm font-medium cursor-pointer"
                >
                  Sign Up
                </Button>
              </SignUpButton>
              <SignInButton>
                <Button
                  variant="default"
                  size="sm"
                  className="h-9 px-4 text-sm font-medium cursor-pointer"
                >
                  Sign In
                </Button>
              </SignInButton>
            </nav>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
