const stats = [
  { value: "500+",     label: "Premium trips delivered" },
  { value: "4.9★",    label: "Average client rating"   },
  { value: "£0",       label: "Booking fees, ever"      },
  { value: "Same day", label: "Quote turnaround"        },
];

export function StatsStrip() {
  return (
    <div className="bg-navy">
      <div className="container-page grid grid-cols-2 divide-x divide-white/10 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={[
              "flex flex-col items-center gap-1.5 px-4 py-8 text-center",
              i < 2 ? "border-b border-white/10 lg:border-b-0" : "",
            ].join(" ")}
          >
            <span className="font-display text-3xl font-bold text-gold sm:text-4xl">
              {s.value}
            </span>
            <span className="text-[11px] font-medium tracking-wide text-navy-fg/55 sm:text-xs">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
