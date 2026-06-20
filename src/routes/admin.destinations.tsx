import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { destinations } from "@/data/destinations";

export const Route = createFileRoute("/admin/destinations")({
  component: AdminDestinationsPage,
});

function AdminDestinationsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Destinations</h1>
          <p className="mt-1 text-sm text-gray-500">{destinations.length} destinations on the site.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90">
          <Plus className="h-4 w-4" />
          Add destination
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {destinations.map((d) => (
          <div key={d.slug} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="relative h-40 overflow-hidden bg-gray-100">
              <img src={d.heroImage} alt={d.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                  {d.region}
                </span>
                <span className="text-sm font-bold text-white">from £{d.fromPrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 leading-snug">{d.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-gray-500">{d.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {d.tripType.map((t) => (
                  <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">{t}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-400">{d.durationNights} nights · {d.budgetBand}</span>
                <div className="flex items-center gap-1.5">
                  <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
