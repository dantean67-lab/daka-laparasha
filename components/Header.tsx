"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { SITE_NAME } from "@/lib/site";

// Sticky header. In RTL the first item (site name) sits on the right,
// the archive link and theme toggle sit on the left.
// A print page (/parasha/[slug]/print) must be completely clean: no navigation at all,
// on screen or on paper. usePathname() also reports the correct path during the initial
// server render, so the header is simply absent from the start on that route - no flash.
export default function Header() {
  const pathname = usePathname();
  if (pathname.endsWith("/print")) return null;

  return (
    <header className="font-ui sticky top-0 z-10 border-b border-line bg-bg">
      <div className="mx-auto flex max-w-[680px] items-center justify-between gap-3 px-5 py-2">
        <Link href="/" className="text-xl font-bold text-accent no-underline">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/archive"
            className="inline-flex min-h-11 items-center px-3 text-base text-text no-underline hover:text-accent"
          >
            ארכיון
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
