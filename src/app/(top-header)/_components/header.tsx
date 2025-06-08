import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { buttonVariants } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center px-4">
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <span className="text-2xl font-bold">
            ACC<span className="text-slate-900">.</span>
          </span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link
                href="/challenges"
                className={buttonVariants({
                  variant: "ghost",
                  className:
                    "text-sm border-b-2 rounded-none rounded-t-lg border-b-primary",
                })}
              >
                Challenges
              </Link>
            </NavigationMenuItem>

            <SignedIn>
              <NavigationMenuItem>
                <Link
                  href="/submissions"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  Submissions
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/profile"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  Profile
                </Link>
              </NavigationMenuItem>
            </SignedIn>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-3">
            <Link
              href="https://cal.com/tomas-calle-1oj8wr/30min"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "h-9 px-4 text-sm font-medium",
              })}
            >
              Host Challenge
            </Link>
            <Link
              href="https://cal.com/tomas-calle-1oj8wr/30min"
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "h-9 px-4 text-sm font-medium",
              })}
            >
              Find Talent
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
