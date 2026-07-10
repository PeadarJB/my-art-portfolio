"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const safePath = pathname ?? "/";

  return (
    <header className="site-header">
      <div className="brand-lockup">
        <p className="brand-title">Peadar Jolliffe-Byrne</p>
        <p className="brand-subtitle">Artist Portfolio</p>
      </div>
      <nav className="site-nav" aria-label="Primary">
        {navItems.map((item) => {
          const active =
            item.href === "/" ? safePath === item.href : safePath.startsWith(item.href);

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
        <ThemeToggle />
      </nav>
    </header>
  );
}
