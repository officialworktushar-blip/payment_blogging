import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, RevealItem } from "@/components/animations/reveal";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Plain-language placeholder privacy policy for ${siteConfig.name}.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      <Reveal className="max-w-3xl pt-8">
        <RevealItem>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">
            {siteConfig.name} privacy
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-navy-900">
            Privacy policy, in plain language.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            This is a placeholder policy for {siteConfig.name}. It describes what data this site may
            store and why. Replace it with a reviewed policy before launch.
          </p>
        </RevealItem>
      </Reveal>

      <Reveal className="mt-10 grid gap-5 md:grid-cols-2">
        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">What we may store</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              If you send a support form, we may store the name, email address and message details you
              provide. If basic analytics is enabled, we may store limited usage information such as
              pages viewed, device type and approximate region.
            </p>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">Why we store it</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Support details help us answer questions, fix errors and keep a short record of the
              conversation. Basic analytics, if enabled, helps us understand which guides are useful
              and where the site needs improvement.
            </p>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">How long we keep it</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              We keep support messages only as long as needed to respond and maintain a reasonable
              record, then remove them. Analytics data should be kept in summary form or for a short,
              documented period. Set exact retention periods before launch.
            </p>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">
              Sensitive details to avoid
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Do not submit card numbers, UPI IDs, passwords, OTPs, PINs or CVVs through the support
              form or email. If you need to describe a payment concept, use a fictional example
              instead.
            </p>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">Sharing and safety</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              We do not sell support details. Service providers may process limited data only to run
              this site, such as hosting or analytics. Document each provider and its safeguards
              before launch.
            </p>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">Contact us</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              To ask about a support message, request removal or suggest a correction, use the
              contact page linked below. Include only the details needed to find your request.
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
