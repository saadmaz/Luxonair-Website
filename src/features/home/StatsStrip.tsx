const stats = [
  { value: "500+",     label: "Premium trips delivered" },
  { value: "4.9★",    label: "Average client rating"   },
  { value: "£0",       label: "Booking fees, ever"      },
  { value: "Same day", label: "Quote turnaround"        },
];

export function StatsStrip() {
  return (
    <div className="relative overflow-hidden bg-navy">
      {/* Thin gold accent line at the very top */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold to-transparent opacity-60" />

      {/* Subtle radial glow behind the grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,oklch(0.695_0.148_72/0.07),transparent)]" />

      <div className="container-page relative">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={[
                "group flex flex-col items-center gap-1.5 px-4 py-10 text-center",
                // Vertical dividers
                i > 0 ? "border-l border-white/8" : "",
                // Horizontal divider on mobile between row 1 & 2
                i < 2 ? "border-b border-white/8 lg:border-b-0" : "",
              ].join(" ")}
            >
              <dt className="font-display text-4xl font-bold text-gold transition-transform duration-300 group-hover:scale-105 sm:text-5xl">
                {s.value}
              </dt>
              <dd className="text-xs font-medium uppercase tracking-[0.12em] text-navy-fg/55 sm:text-[13px]">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Thin gold accent line at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-gold to-transparent opacity-40" />
    </div>
  );
}
