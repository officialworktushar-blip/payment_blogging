import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { FloatingCoins } from "@/components/animations/floating-coins";
import { PaymentFlowHero } from "@/components/animations/payment-flow-hero";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/container";
import type { BlogWithCategory } from "@/lib/types";

interface HeroFeaturedProps {
  eyebrow?: string;
  title: string;
  description: string;
  featuredPost?: BlogWithCategory | null;
  actions?: ReactNode;
}

export function HeroFeatured({
  eyebrow = "Payments, decoded",
  title,
  description,
  featuredPost,
  actions,
}: HeroFeaturedProps) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <FloatingCoins />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.35)_1px,transparent_0)] [background-size:28px_28px]"
      />

      <Container className="relative grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-200">
            <Sparkles aria-hidden="true" size={13} />
            {eyebrow}
          </span>
          <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">{description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>

          {featuredPost ? (
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="arrow-link mt-10 block max-w-xl rounded-xl border border-white/10 bg-white/5 p-4 hover:border-brand-300/40"
            >
              <span className="text-[11px] font-semibold uppercase tracking-widest text-brand-300">
                Featured guide
              </span>
              <span className="mt-2 flex items-start justify-between gap-3 font-serif text-lg font-semibold text-white">
                {featuredPost.title}
                <ArrowRight aria-hidden="true" size={17} className="arrow-icon mt-1 shrink-0 text-brand-300" />
              </span>
            </Link>
          ) : null}
        </Reveal>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-sm sm:p-5">
          <PaymentFlowHero />
        </div>
      </Container>
    </section>
  );
}
