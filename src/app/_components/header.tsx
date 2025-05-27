import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button, buttonVariants } from "~/components/ui/button";

export function Header() {
  return (
    <header className="flex justify-between items-center p-4 h-16 border-b border-dashed border-border">
      <div className="flex items-center">
        <Link href="/" className="font-bold text-2xl">
          ACC<span className="text-primary">.</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <Button className="cursor-pointer" variant="ghost" size="sm">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="cursor-pointer" variant="default" size="sm">
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <Link
            className={buttonVariants({ variant: "ghost" })}
            href="/dashboard"
          >
            Dashboard
          </Link>
        </SignedIn>
      </div>
    </header>
  );
}
