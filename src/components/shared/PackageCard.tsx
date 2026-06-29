import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Info, MapPin, MoveHorizontal, Mic2, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { HolidayPackage } from "@/types/holiday-package";

export function PackageCard({ pkg }: { pkg: HolidayPackage }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="relative h-52 shrink-0 overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-gold-foreground shadow-sm">
          {pkg.badge}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-display text-[1.05rem] font-semibold leading-snug">
          {pkg.title}
        </h3>

        <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-teal" />
            {pkg.country}
          </span>
          <span className="flex items-center gap-1">
            <MoveHorizontal className="h-3 w-3 text-teal" />
            {pkg.days} Days / {pkg.nights} Nights
          </span>
        </div>

        {/* Pricing + CTA pushed to bottom */}
        <div className="mt-auto">
          <div className="my-4 border-t border-border" />

          <div className="flex items-center justify-between gap-2">
            <Link
              to="/quote"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-gold-foreground transition-colors hover:bg-gold/90"
            >
              Book Now <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                per person
              </p>
              <p className="text-xl font-bold text-foreground">
                £{pkg.fromPrice.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Experience & Inclusion footer */}
          <div className="mt-4 flex items-center gap-5 border-t border-border pt-3">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger className="flex cursor-default items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
                  <Mic2 className="h-3 w-3 text-teal" />
                  Experience
                  <Info className="h-3 w-3 text-muted-foreground/40" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-56 text-xs">
                  <ul className="space-y-1">
                    {pkg.experiences.map((e) => (
                      <li key={e} className="flex gap-1">
                        <span className="mt-0.5 text-teal">•</span> {e}
                      </li>
                    ))}
                  </ul>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger className="flex cursor-default items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
                  <Plus className="h-3 w-3 text-teal" />
                  Inclusion
                  <Info className="h-3 w-3 text-muted-foreground/40" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-56 text-xs">
                  <ul className="space-y-1">
                    {pkg.inclusions.map((i) => (
                      <li key={i} className="flex gap-1">
                        <span className="mt-0.5 text-teal">•</span> {i}
                      </li>
                    ))}
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
