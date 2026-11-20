import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/animations/reveal";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description: `About ${siteConfig.name}, an independent payment education project with fictional examples.`,
  alternates: { canonical: "/about-us" },
};

export default function AboutUsPage() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "About Us" }]} />

      <Reveal className="max-w-3xl pt-8">
        <RevealItem>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">
            About {siteConfig.name}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-navy-900">
            Independent payment education, without the jargon.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {siteConfig.name} is an independent education project for readers who want to understand
            what happens behind a tap, swipe or transfer. We are not a bank or payment provider, and
            we do not process payments.
          </p>
        </RevealItem>
      </Reveal>

      <Reveal className="mt-10 grid gap-5 md:grid-cols-2">
        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">Our mission</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Make everyday payment concepts understandable. We explain how the pieces fit together,
              which questions to ask, and where to check official details before making a decision.
            </p>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">What we cover</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Cards, UPI, wallets, payment gateways, net banking, refunds, chargebacks and payment
              safety. Every example uses invented details, so nothing here is a real account or
              transaction.
            </p>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">The team</h2>
            <div className="mt-4 flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 font-serif text-lg font-semibold text-white">
                PL
              </span>
              <div>
                <h3 className="font-semibold text-navy-900">PayLens editorial team</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Placeholder profile. Replace this card with real names and short biographies before
                  launch.
                </p>
              </div>
            </div>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">Why trust us</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              We keep education separate from promotion, use fictional examples and never ask for
              sensitive payment details. We are not a bank or payment provider, and we do not process
              payments. For account-specific questions, use your bank or provider&apos;s official
              channels.
            </p>
          </section>
        </RevealItem>
      </Reveal>

      <Reveal className="mt-8 rounded-2xl border border-brand-100 bg-navy-50/60 p-6 sm:p-8">
        <RevealItem className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-navy-900">Keep learning</h2>
            <p className="mt-1 text-sm leading-7 text-slate-600">
              Browse plain-language guides or ask us about a topic you would like explained next.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500"
            >
              Read the blog
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link
              href="/contact-support"
              className="inline-flex rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-navy-900 hover:border-brand-400 hover:text-brand-700"
            >
              Contact Support+
            </Link>
          </div>
        </RevealItem>
      </Reveal>
    </Container>
  );
}
