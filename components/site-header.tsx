"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ScanLine, Search, X } from "lucide-react";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold text-navy-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 text-white">
            <ScanLine aria-hidden="true" size={20} />
          </span>
          <span className="text-lg tracking-tight">{siteConfig.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          {siteConfig.nav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-2 py-2 text-[11px] font-medium xl:px-2.5 xl:text-xs ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-navy-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/search"
            aria-label="Search articles"
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-brand-700"
          >
            <Search aria-hidden="true" size={19} />
          </Link>
          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
            className="rounded-md p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            {isOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
          </button>
        </div>
      </Container>

      {isOpen ? (
        <nav aria-label="Mobile" className="max-h-[70vh] overflow-y-auto border-t border-slate-200 bg-white lg:hidden">
          <Container className="py-3">
            <ul className="grid gap-1 sm:grid-cols-2">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
