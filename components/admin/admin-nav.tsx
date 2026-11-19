"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, FolderTree, LayoutDashboard, LifeBuoy, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

const adminNav: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "All Blogs", icon: FileText },
  { href: "/admin/posts/new", label: "Add New Blog", icon: Plus },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/support-requests", label: "Support Requests", icon: LifeBuoy },
];

export function AdminNav({ variant = "sidebar" }: { variant?: "sidebar" | "top" }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin"
      className={variant === "sidebar" ? "flex flex-col gap-1" : "flex min-w-max gap-1"}
    >
      {adminNav.map((item) => {
        const Icon = item.icon;
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
              active
                ? "bg-brand-600 text-white"
                : variant === "sidebar"
                  ? "text-slate-300 hover:bg-white/10 hover:text-white"
                  : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Icon aria-hidden="true" size={16} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
