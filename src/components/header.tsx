
"use client";

import Link from "next/link";
import { Sprout, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslation } from "@/hooks/use-translation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' }, // Hindi
  { code: 'bn', name: 'বাংলা' }, // Bengali
  { code: 'ta', name: 'தமிழ்' }, // Tamil
  { code: 'te', name: 'తెలుగు' }, // Telugu
  { code: 'mr', name: 'मराठी' }, // Marathi
];

export function Header() {
  const { t, setLanguage, currentLanguage } = useTranslation();

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
            {t('Discover')}
          </Link>
          <Link
            href="/list-your-space"
            className="transition-colors hover:text-primary"
          >
            {t('List Your Space')}
          </Link>
          <Link
            href="/discover-from-image"
            className="transition-colors hover:text-primary"
          >
            {t('Discover from Image')}
          </Link>
          <Link
            href="/community"
            className="transition-colors hover:text-primary"
          >
            {t('Community')}
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-primary"
          >
            {t('About')}
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onSelect={() => setLanguage(lang.code)}
                  className={currentLanguage === lang.code ? "bg-accent" : ""}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost">{t('Log In')}</Button>
          <Button>{t('Sign Up')}</Button>
        </div>
      </div>
    </header>
  );
}
