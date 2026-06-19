import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  /** Gold eyebrow label rendered above the heading */
  eyebrow: string;
  title: string;
  /** Optional "see all" link; hidden on mobile, visible at sm+ breakpoint */
  cta?: { label: string; to: string };
}

// Shared eyebrow + heading + desktop CTA used across multiple home sections.
// Extracted from routes/index.tsx so any future page can import it without
// duplicating the layout or Tailwind classes.
export function SectionHeader({ eyebrow, title, cta }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-balance">
          {title}
        </h2>
      </div>
      {cta && (
        <Link
          to={cta.to}
          className="hidden shrink-0 items-center gap-1 text-sm font-medium hover:text-primary sm:inline-flex"
        >
          {cta.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
