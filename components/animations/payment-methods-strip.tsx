"use client";

import {
  ArrowLeftRight,
  CreditCard,
  Landmark,
  QrCode,
  Repeat2,
  Send,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const METHODS: { label: string; icon: LucideIcon }[] = [
  { label: "UPI", icon: Send },
  { label: "Cards", icon: CreditCard },
  { label: "Net Banking", icon: Landmark },
  { label: "Wallets", icon: Wallet },
  { label: "QR", icon: QrCode },
  { label: "Bank Transfer", icon: ArrowLeftRight },
  { label: "Buy Now Pay Later", icon: Repeat2 },
];

export function PaymentMethodsStrip() {
  return (
    <div className="marquee-shell overflow-hidden border-y border-slate-200 bg-white py-4">
      <div className="marquee-track flex w-max items-center gap-3">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center gap-3"
          >
            {METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <span
                  key={method.label}
                  className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600"
                >
                  <Icon aria-hidden="true" size={15} className="text-brand-600" />
                  {method.label}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
