import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, RevealItem } from "@/components/animations/reveal";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms",
  description: `Plain-language placeholder terms for using ${siteConfig.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Terms" }]} />

      <Reveal className="max-w-3xl pt-8">
        <RevealItem>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">
            {siteConfig.name} terms
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-navy-900">
            Terms, in plain language.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            These are placeholder terms for {siteConfig.name}. They set out the basic rules for using
            this site. Replace them with a reviewed version before launch.
          </p>
        </RevealItem>
      </Reveal>

      <Reveal className="mt-10 grid gap-5 md:grid-cols-2">
        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">Educational use</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              You may read, share and reference these guides for learning. Copy large portions only
              with clear attribution, and do not present the material as your own.
            </p>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">No professional advice</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Content is for education only, not financial or legal advice. We are not a bank or
              payment provider, and we do not process payments. Speak to a qualified professional for
              advice about your situation.
            </p>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">No guaranteed outcomes</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Payment rules, fees and timelines change. We do not promise that following a guide will
              prevent fraud, secure a refund, win a chargeback or produce any particular result.
            </p>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">External links</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Links to other sites are provided for convenience. We do not control those sites and are
              not responsible for their content, security or practices. Check official sources before
              sharing information.
            </p>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">Acceptable use</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Do not use this site to break the law, mislead others, submit real payment or identity
              details, overload the site, scrape content aggressively or interfere with other users.
            </p>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">Changes and contact</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              We may update these placeholder terms as the project develops. For a question or a
              reported issue, contact us through the page linked below.
            </p>
            <Link
              href="/contact-support"
              className="mt-4 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-brand-700 hover:border-brand-400"
            >
              Contact Support+
            </Link>
          </section>
        </RevealItem>
      </Reveal>
    </Container>
  );
}
