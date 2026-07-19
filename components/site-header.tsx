"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { siteName } from "@/lib/site";

const navItems = [
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

/**
 * Global header bar: brand left, nav right, hairline bottom rule. Rules and
 * hover accents resolve from the room tokens, so the same header reads
 * correctly inside the soot room on the Upland Folk gallery chapter.
 */
export function SiteHeader() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label={`${siteName}, home`}>
        {siteName}
      </Link>
      <nav className="site-nav" aria-label="Primary">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx({ "is-active": active })}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
