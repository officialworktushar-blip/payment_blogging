import type { Metadata } from "next";
import { Clock3, Mail, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { SupportForm } from "@/components/support-form";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Support+",
  description: "Send a support request to the PayLens team.",
  alternates: { canonical: "/contact-support" },
};

export default function ContactSupportPage() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Contact Support+" }]} />

      <div className="mt-8 grid gap-8 md:grid-cols-5">
        <section className="md:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Get in touch</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-navy-900">
            Contact Support+
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Have a question about a payment guide, a correction or an idea for a new topic? Send us a
            short request and we will get back to you. For examples, use fictional data such as 4111
            xxxx xxxx 1111 and user@example.
          </p>

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <h2 className="font-serif text-xl font-semibold text-navy-900">Send a request</h2>
            <p className="mb-6 mt-1 text-sm text-slate-500">
              Fields marked as required help us route your message to the right person.
            </p>
            <SupportForm />
          </div>
        </section>

        <aside className="space-y-4 md:col-span-2" aria-label="Other ways to reach us">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <Mail aria-hidden="true" size={20} className="text-brand-700" />
            <h2 className="mt-4 font-serif text-lg font-semibold text-navy-900">Email</h2>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="mt-2 block break-all text-sm text-brand-700 hover:underline"
            >
              {siteConfig.contact.email}
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <Phone aria-hidden="true" size={20} className="text-brand-700" />
            <h2 className="mt-4 font-serif text-lg font-semibold text-navy-900">Phone</h2>
            <p className="mt-2 text-sm text-slate-600">{siteConfig.contact.phone}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <Clock3 aria-hidden="true" size={20} className="text-brand-700" />
            <h2 className="mt-4 font-serif text-lg font-semibold text-navy-900">Hours</h2>
            <p className="mt-2 text-sm text-slate-600">{siteConfig.contact.hours}</p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
