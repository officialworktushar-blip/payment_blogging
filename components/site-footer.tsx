import Link from "next/link";
import { Mail, Phone, Clock3 } from "lucide-react";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <Container className="grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="text-base font-semibold text-slate-900">{siteConfig.name}</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
            {siteConfig.description}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brand-700">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">Contact</p>
          <ul className="mt-3 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <Mail aria-hidden="true" size={16} className="mt-0.5 shrink-0" />
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-brand-700">
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone aria-hidden="true" size={16} className="mt-0.5 shrink-0" />
              <span>{siteConfig.contact.phone}</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock3 aria-hidden="true" size={16} className="mt-0.5 shrink-0" />
              <span>{siteConfig.contact.hours}</span>
            </li>
          </ul>
        </div>
      </Container>

      <Container className="border-t border-slate-200 py-6">
        <p className="text-xs text-slate-500">
          Educational content only. All card, UPI and account examples on {siteConfig.name} are
          fictional.
        </p>
      </Container>
    </footer>
  );
}
