import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "~/components/ui/button";

export function TestNav() {
  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="flex gap-2">
        <Link href="/">
          <Button variant="outline" size="sm">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
        <Link href="/onboarding">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Onboarding
          </Button>
        </Link>
      </div>
    </div>
  );
} 