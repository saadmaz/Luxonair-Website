import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { deals } from "@/data/deals";

export const Route = createFileRoute("/admin/deals")({
  component: AdminDealsPage,
});

function AdminDealsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="mt-1 text-sm text-gray-500">{deals.length} active deals on the site.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90">
          <Plus className="h-4 w-4" />
          Add deal
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Deal", "Region", "Nights", "Board", "Price", "Was", "Badge", "Expires", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 first:pl-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deals.map((d) => (
                <tr key={d.id} className="transition-colors hover:bg-gray-50/60">
                  <td className="py-4 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img src={d.image} alt={d.title} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 leading-snug">{d.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{d.blurb}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{d.region}</td>
                  <td className="px-4 py-4 text-gray-600">{d.nights}n</td>
                  <td className="px-4 py-4 text-gray-600">{d.board}</td>
                  <td className="px-4 py-4 font-semibold text-gray-900">£{d.fromPrice.toLocaleString()}</td>
                  <td className="px-4 py-4 text-gray-400 line-through">
                    {d.oldPrice ? `£${d.oldPrice.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#042045]/8 px-2.5 py-0.5 text-xs font-medium text-[#042045]">
                      <Tag className="h-3 w-3" />
                      {d.badge}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-400">{new Date(d.expires).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y divide-gray-100 md:hidden">
          {deals.map((d) => (
            <div key={d.id} className="flex gap-3 px-5 py-4">
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <img src={d.image} alt={d.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-snug truncate">{d.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{d.nights}n · {d.board} · {d.region}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">£{d.fromPrice.toLocaleString()}</span>
                  {d.oldPrice && <span className="text-xs text-gray-400 line-through">£{d.oldPrice.toLocaleString()}</span>}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50"><Pencil className="h-3.5 w-3.5" /></button>
                <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
