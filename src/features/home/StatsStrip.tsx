// Horizontal four-stat KPI bar shown immediately below the hero.
// Values are hardcoded here; if they ever need to come from SITE.stats,
// swap to { SITE } from "@/config/site" imports.
export function StatsStrip() {
  const stats = [
    { value: "500+", label: "Premium trips delivered" },
    { value: "4.9★", label: "Average client rating" },
    { value: "£0",   label: "Booking fees, ever" },
    { value: "Same day", label: "Quote turnaround" },
  ];

  return (
    <div className="border-y border-border bg-card shadow-sm">
      <div className="container-page grid grid-cols-2 gap-4 py-8 sm:gap-6 lg:grid-cols-4 lg:py-10">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-2xl font-semibold text-gold sm:text-3xl">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
