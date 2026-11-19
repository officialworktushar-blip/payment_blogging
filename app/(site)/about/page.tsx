import type { Metadata } from "next";
import { BookOpenCheck, Eye, ShieldCheck } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "About",
  description: "Why PayLens exists and how we keep payment education clear and fictional.",
};

const values = [
  {
    icon: BookOpenCheck,
    title: "Plain language first",
    text: "Payment rails are complicated. Our job is to translate them without talking down to readers.",
  },
  {
    icon: ShieldCheck,
    title: "Safety by default",
    text: "We never show real card numbers, UPI handles, OTPs or CVVs. Every example is deliberately fake.",
  },
  {
    icon: Eye,
    title: "Clarity over hype",
    text: "We explain trade-offs and everyday decisions instead of chasing payment buzzwords.",
  },
];

export default function AboutPage() {
  return (
    <Container className="py-12">
      <FadeIn className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">About</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Payments are everywhere. They should be understandable.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          PayLens is a payments education blog for curious readers: students, first-time freelancers,
          small business owners and anyone who wants to know what happens between a tap and a
          settlement. We cover cards, UPI, wallets, gateways, refunds and the safety habits that
          protect your money.
        </p>
      </FadeIn>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <FadeIn key={value.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Icon aria-hidden="true" size={20} />
              </span>
              <h2 className="mt-4 text-base font-semibold text-slate-900">{value.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{value.text}</p>
            </FadeIn>
          );
        })}
      </div>
    </Container>
  );
}
