const stats = [
  { value: "500+",     label: "Premium trips delivered" },
  { value: "4.9★",    label: "Average client rating"   },
  { value: "£0",       label: "Booking fees, ever"      },
  { value: "Same day", label: "Quote turnaround"        },
];

export function StatsStrip() {
  return (
    <div className="relative bg-card">
      {/* Top gold hairline */}
      <div className="h-px bg-linear-to-r from-transparent via-gold/50 to-transparent" />

      <div className="container-page">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={[
                "flex flex-col items-center gap-3 px-6 py-10 text-center",
                i > 0 ? "border-l border-border" : "",
                i < 2 ? "border-b border-border lg:border-b-0" : "",
              ].join(" ")}
            >
              <span className="font-display text-4xl font-bold text-gold sm:text-5xl">
                {s.value}
              </span>
              {/* Thin gold rule between number and label */}
              <span className="block h-px w-8 bg-gold/40" />
              <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom border */}
      <div className="h-px bg-border" />
    </div>
  );
}
