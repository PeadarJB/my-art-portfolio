"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { ThemeToggle } from "@/components/theme-toggle";
import { useUIStore } from "@/lib/store/ui-store";

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
  const navOpen = useUIStore((state) => state.navOpen);
  const setNavOpen = useUIStore((state) => state.setNavOpen);

  // Collapse the mobile menu whenever the route changes.
  useEffect(() => {
    setNavOpen(false);
  }, [safePath, setNavOpen]);

  // Allow Escape to close the open mobile menu.
  useEffect(() => {
    if (!navOpen) {
      return;
    }
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNavOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [navOpen, setNavOpen]);

  return (
    // Full-width sticky surface (background + border span the viewport) with a
    // centred inner container capped at --canvas-max so the visible header
    // content aligns with the page content on ultra-wide displays.
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand-lockup" aria-label="Peadar Jolliffe-Byrne, home">
          <span className="brand-title">Peadar Jolliffe-Byrne</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={navOpen}
          aria-controls="primary-navigation"
          aria-label={navOpen ? "Close menu" : "Open menu"}
          onClick={() => setNavOpen(!navOpen)}
        >
          <span className="nav-toggle-bars" aria-hidden="true" />
        </button>

        <nav
          id="primary-navigation"
          className={clsx("site-nav", { "is-open": navOpen })}
          aria-label="Primary"
        >
          {navItems.map((item) => {
            const active =
              item.href === "/" ? safePath === item.href : safePath.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx({ "is-active": active })}
                aria-current={active ? "page" : undefined}
                onClick={() => setNavOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
