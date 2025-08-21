import { Sprout, Instagram, Twitter, Facebook } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-headline">VillageStay+</span>
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm">
              © {new Date().getFullYear()} VillageStay+. All rights reserved.
            </p>
            <p className="text-xs">
              Empowering rural India through authentic travel experiences.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" aria-label="Instagram">
              <Instagram className="h-5 w-5 hover:text-primary transition-colors" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Twitter className="h-5 w-5 hover:text-primary transition-colors" />
            </Link>
            <Link href="#" aria-label="Facebook">
              <Facebook className="h-5 w-5 hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
