
"use client";

import Link from "next/link";
import { Sprout } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Sprout className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl font-headline text-foreground">
            VillageStay+
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-primary"
          >
            Discover
          </Link>
          <Link
            href="/list-your-space"
            className="transition-colors hover:text-primary"
          >
            List Your Space
          </Link>
          <Link
            href="/discover-from-image"
            className="transition-colors hover:text-primary"
          >
            Discover from Image
          </Link>
          <Link
            href="/community"
            className="transition-colors hover:text-primary"
          >
            Community
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-primary"
          >
            About
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <Button variant="ghost">Log In</Button>
          <Button>Sign Up</Button>
        </div>
      </div>
    </header>
  );
}
