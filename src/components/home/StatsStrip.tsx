// Horizontal four-stat KPI bar shown immediately below the hero.
// Values are hardcoded here; if they ever need to come from SITE.stats,
// swap to { SITE } from "@/lib/siteConfig" imports.
export function StatsStrip() {
  const stats = [
    { value: "500+", label: "Premium trips delivered" },
    { value: "4.9★", label: "Average client rating" },
    { value: "£0",   label: "Booking fees, ever" },
    { value: "4 hrs", label: "Quote response time" },
  ];

  return (
    <div className="border-y border-border bg-card shadow-sm">
      <div className="container-page grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-3xl font-semibold text-gold">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
