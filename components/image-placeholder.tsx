import { ImageIcon } from "lucide-react";
import type { ReactNode } from "react";

interface ImagePlaceholderProps {
  label: string;
  className?: string;
  icon?: ReactNode;
}

export function ImagePlaceholder({ label, className = "", icon }: ImagePlaceholderProps) {
  return (
    <div
      className={`flex h-full min-h-40 flex-col items-center justify-center gap-2 bg-slate-100 px-5 text-center ${className}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/80 text-slate-500">
        {icon ?? <ImageIcon aria-hidden="true" size={18} />}
      </span>
      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</span>
    </div>
  );
}
