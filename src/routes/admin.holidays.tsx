import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { holidayTypes } from "@/data/holidayTypes";

export const Route = createFileRoute("/admin/holidays")({
  component: AdminHolidaysPage,
});

function AdminHolidaysPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Holiday Types</h1>
          <p className="mt-1 text-sm text-gray-500">{holidayTypes.length} holiday categories on the site.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90">
          <Plus className="h-4 w-4" />
          Add holiday type
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {holidayTypes.map((h) => (
          <div key={h.slug} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="relative h-36 overflow-hidden bg-gray-100">
              <img src={h.heroImage} alt={h.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-lg font-bold text-white">{h.name}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs font-medium text-[#042045]/70 italic">"{h.tagline}"</p>
              <p className="mt-2 line-clamp-2 text-xs text-gray-500">{h.summary}</p>

              <div className="mt-3 space-y-1">
                {h.bullets.map((b) => (
                  <div key={b} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="h-1 w-1 rounded-full bg-[#042045]/40 shrink-0" />
                    {b}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-400">{h.destinationSlugs.length} destination{h.destinationSlugs.length !== 1 ? "s" : ""} linked</span>
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
