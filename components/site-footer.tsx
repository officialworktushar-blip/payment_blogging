import Link from "next/link";
import { Clock3, Mail, Phone, ScanLine } from "lucide-react";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-navy-950 text-slate-300">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <ScanLine aria-hidden="true" size={19} />
            </span>
            <span className="text-lg font-semibold tracking-tight">{siteConfig.name}</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            {siteConfig.description}
          </p>
          <p className="mt-4 font-serif text-sm italic text-brand-200">{siteConfig.tagline}</p>
        </div>

        {siteConfig.footerColumns.map((column) => (
          <div key={column.title}>
            <p className="text-sm font-semibold text-white">{column.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="text-sm font-semibold text-white">Stay in touch</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <Mail aria-hidden="true" size={15} className="mt-0.5 shrink-0 text-brand-300" />
              <a href={`mailto:${siteConfig.contact.email}`} className="break-all hover:text-brand-300">
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone aria-hidden="true" size={15} className="mt-0.5 shrink-0 text-brand-300" />
              <span>{siteConfig.contact.phone}</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock3 aria-hidden="true" size={15} className="mt-0.5 shrink-0 text-brand-300" />
              <span>{siteConfig.contact.hours}</span>
            </li>
          </ul>
        </div>
      </Container>

      <Container className="border-t border-white/10 py-6">
        <p className="text-xs leading-5 text-slate-400">
          Content is for education only, not financial or legal advice. Never share your OTP, PIN or
          CVV with anyone.
        </p>
      </Container>
    </footer>
  );
}
