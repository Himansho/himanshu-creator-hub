"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/lib/actions";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", exact: true },
  { href: "/dashboard/projects/new", label: "New Project", exact: false },
  { href: "/dashboard/settings", label: "Settings", exact: false },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-base/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          <Link
            href="/"
            className="mr-2 shrink-0 text-sm font-semibold tracking-widest uppercase"
          >
            HB<span className="text-accent">.</span>
          </Link>
          {LINKS.map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:bg-white/5 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="hidden rounded-full px-3.5 py-1.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-ink sm:block"
          >
            Public site ↗
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-full px-3.5 py-1.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-danger"
            >
              Log out
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
}
