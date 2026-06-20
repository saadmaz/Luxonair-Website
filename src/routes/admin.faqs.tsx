import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown } from "lucide-react";
import { faqGroups } from "@/data/faq";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/faqs")({
  component: AdminFaqsPage,
});

const totalFaqs = faqGroups.reduce((sum, g) => sum + g.items.length, 0);

function AdminFaqsPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="mt-1 text-sm text-gray-500">
            {totalFaqs} questions across {faqGroups.length} categories.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Plus className="h-4 w-4" />
            Add category
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90">
            <Plus className="h-4 w-4" />
            Add question
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {faqGroups.map((group) => (
          <div key={group.title} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Group header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/60 px-6 py-3.5">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-gray-900">{group.title}</h2>
                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                  {group.items.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-white hover:text-gray-600">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* FAQ items */}
            <div className="divide-y divide-gray-100">
              {group.items.map((item, i) => {
                const key = `${group.title}-${i}`;
                const isOpen = openKey === key;
                return (
                  <div key={key}>
                    <button
                      onClick={() => setOpenKey(isOpen ? null : key)}
                      className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50/60"
                    >
                      <span className="pr-6 text-sm font-medium text-gray-800">{item.q}</span>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="rounded-lg border border-gray-200 p-1 text-gray-300 hover:bg-white hover:text-gray-600"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="rounded-lg border border-gray-200 p-1 text-gray-300 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="border-t border-gray-100 bg-blue-50/30 px-6 py-4">
                        <p className="text-sm leading-relaxed text-gray-600">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add question to group */}
            <div className="border-t border-gray-100 px-6 py-3">
              <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-[#042045]">
                <Plus className="h-3.5 w-3.5" />
                Add question to "{group.title}"
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
