import type { Metadata } from "next";
import { Clock3, Mail, Phone } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the PayLens team.",
};

export default function ContactPage() {
  return (
    <Container className="py-12">
      <FadeIn className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Contact</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Questions, corrections or topic ideas?
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          We would love to hear which payment concept you want explained next. The details below are
          placeholders for this starter project and should be replaced before launch.
        </p>
      </FadeIn>

      <div className="mt-9 grid gap-5 md:grid-cols-3">
        <FadeIn className="rounded-2xl border border-slate-200 bg-white p-6">
          <Mail aria-hidden="true" size={20} className="text-brand-700" />
          <h2 className="mt-4 text-sm font-semibold text-slate-900">Email</h2>
          <a href={`mailto:${siteConfig.contact.email}`} className="mt-2 block break-all text-sm text-brand-700 hover:underline">
            {siteConfig.contact.email}
          </a>
        </FadeIn>

        <FadeIn className="rounded-2xl border border-slate-200 bg-white p-6">
          <Phone aria-hidden="true" size={20} className="text-brand-700" />
          <h2 className="mt-4 text-sm font-semibold text-slate-900">Phone</h2>
          <p className="mt-2 text-sm text-slate-600">{siteConfig.contact.phone}</p>
        </FadeIn>

        <FadeIn className="rounded-2xl border border-slate-200 bg-white p-6">
          <Clock3 aria-hidden="true" size={20} className="text-brand-700" />
          <h2 className="mt-4 text-sm font-semibold text-slate-900">Hours</h2>
          <p className="mt-2 text-sm text-slate-600">{siteConfig.contact.hours}</p>
        </FadeIn>
      </div>

      <FadeIn className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
        Never send real card numbers, UPI IDs, OTPs or CVVs by email or phone. Use fictional examples
        such as 4111 xxxx xxxx 1111 and user@example in any test message.
      </FadeIn>
    </Container>
  );
}
