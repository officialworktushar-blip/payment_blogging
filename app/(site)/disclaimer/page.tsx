import type { Metadata } from "next";
import { Reveal, RevealItem } from "@/components/animations/reveal";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `Education-only disclaimer for ${siteConfig.name}.`,
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Disclaimer" }]} />

      <Reveal className="max-w-3xl pt-8">
        <RevealItem>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">
            {siteConfig.name} disclaimer
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-navy-900">
            Clear boundaries for our payment education.
          </h1>
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
            Content is for education only, not financial or legal advice. Never share your OTP, PIN or CVV with anyone.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-600">
            This placeholder disclaimer explains how to use {siteConfig.name}. Replace it with a
            reviewed version before launch.
          </p>
        </RevealItem>
      </Reveal>

      <Reveal className="mt-10 grid gap-5 md:grid-cols-2">
        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">Education only</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Articles, guides and examples are written to explain concepts. They are not
              instructions to move money, accept a payment or choose a specific financial product.
            </p>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">
              Not financial or legal advice
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Nothing on this site creates an adviser, fiduciary, legal or compliance relationship.
              For advice about your situation, speak to a qualified professional.
            </p>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">
              Not a bank or payment provider
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {siteConfig.name} is an independent education project. We are not a bank, payment
              provider, wallet issuer, gateway or card network, and we do not offer accounts.
            </p>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">
              We do not process payments
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              No payment is made, received, held, refunded or disputed through this site. We do not
              collect or handle real card numbers, UPI IDs, OTPs, PINs or CVVs.
            </p>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">Fictional examples</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Names, numbers, handles and scenarios are invented for teaching. Do not treat any
              example as a real account, merchant, transaction or instruction.
            </p>
          </section>
        </RevealItem>

        <RevealItem className="h-full">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-semibold text-navy-900">
              Verify with your bank or provider
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Rules, fees, limits, timelines and dispute processes change. Always verify details with
              your bank or payment provider before acting on a payment decision.
            </p>
          </section>
        </RevealItem>
      </Reveal>
    </Container>
  );
}
