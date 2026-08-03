"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/work", label: "Projects" },
  { href: "/#contact", label: "Contact" },
];

/** Jack-style navbar: evenly spread uppercase links. */
export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
        {/* Desktop: spread links */}
        <div className="hidden w-full items-center justify-between md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 lg:text-[1.4rem]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            aria-label="Admin login"
            title="Admin"
            className="text-[#D7E2EA]/35 transition-opacity duration-200 hover:opacity-70"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </Link>
        </div>

        {/* Mobile: brand + burger */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-widest text-[#D7E2EA]"
            onClick={() => setOpen(false)}
          >
            HB<span className="text-accent">.</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              aria-label="Admin login"
              className="p-2 text-[#D7E2EA]/35"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="p-2 text-[#D7E2EA]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {open ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="mx-6 mt-3 rounded-2xl border border-[#D7E2EA]/15 bg-[#0C0C0C]/95 p-3 backdrop-blur md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 uppercase tracking-wider text-[#D7E2EA]/80 transition-colors hover:bg-white/5 hover:text-[#D7E2EA]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
