"use client";

import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";

export default function Admin() {
  return (
    <div className="w-full px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Admin Dashboard</h1>
        <Link
          href="/admin/challenges/create"
          className={buttonVariants({ variant: "outline" })}
        >
          Create New Challenge
        </Link>
      </div>
    </div>
  );
}
