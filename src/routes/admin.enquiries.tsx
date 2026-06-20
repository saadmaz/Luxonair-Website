import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, CheckCircle2, Circle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/enquiries")({
  component: AdminEnquiriesPage,
});

type Status = "New" | "In Progress" | "Responded";

const enquiries = [
  { id: 1, name: "James Thornton", email: "j.thornton@email.com", phone: "+44 7700 900123", destination: "Maldives", region: "Indian Ocean", tripType: "Honeymoon", travelDate: "Aug 2025", nights: 7, adults: 2, children: 0, budget: "££££", status: "New" as Status, received: "20 Jun 2025", notes: "Interested in overwater villa with private pool." },
  { id: 2, name: "Sarah Mitchell", email: "sarah.m@gmail.com", phone: "+44 7700 900456", destination: "Dubai", region: "Middle East", tripType: "Family", travelDate: "Sep 2025", nights: 5, adults: 2, children: 2, budget: "£££", status: "Responded" as Status, received: "19 Jun 2025", notes: "" },
  { id: 3, name: "Oliver Chen", email: "o.chen@outlook.com", phone: "+44 7700 900789", destination: "Japan", region: "Asia", tripType: "Luxury", travelDate: "Oct 2025", nights: 12, adults: 2, children: 0, budget: "£££", status: "In Progress" as Status, received: "18 Jun 2025", notes: "Wants ryokan experience near Fuji." },
  { id: 4, name: "Emma Patel", email: "emma.p@email.com", phone: "+44 7700 900321", destination: "Bali", region: "Asia", tripType: "Family", travelDate: "Dec 2025", nights: 10, adults: 2, children: 3, budget: "££", status: "New" as Status, received: "17 Jun 2025", notes: "School holiday departure needed." },
  { id: 5, name: "William Fraser", email: "w.fraser@corp.com", phone: "+44 7700 900654", destination: "New York", region: "Americas", tripType: "Business", travelDate: "Jul 2025", nights: 4, adults: 1, children: 0, budget: "££££", status: "Responded" as Status, received: "16 Jun 2025", notes: "Corporate account, single invoice billing." },
  { id: 6, name: "Amelia Johansson", email: "amelia.j@email.com", phone: "+44 7700 900987", destination: "Seychelles", region: "Indian Ocean", tripType: "Honeymoon", travelDate: "Jan 2026", nights: 14, adults: 2, children: 0, budget: "£££££", status: "New" as Status, received: "15 Jun 2025", notes: "" },
  { id: 7, name: "Ravi Kapoor", email: "ravi.k@email.com", phone: "+44 7700 900111", destination: "Santorini", region: "Europe", tripType: "Couples", travelDate: "Sep 2025", nights: 7, adults: 2, children: 0, budget: "£££", status: "In Progress" as Status, received: "14 Jun 2025", notes: "Anniversary trip, caldera view preferred." },
  { id: 8, name: "Claire Beaumont", email: "claire.b@email.com", phone: "+44 7700 900222", destination: "Antigua", region: "Caribbean", tripType: "Family", travelDate: "Oct 2025", nights: 10, adults: 2, children: 2, budget: "£££", status: "New" as Status, received: "13 Jun 2025", notes: "October half-term, kids club required." },
];

const statusConfig: Record<Status, { className: string; icon: typeof Circle }> = {
  New: { className: "bg-blue-50 text-blue-700 ring-blue-200", icon: Circle },
  "In Progress": { className: "bg-amber-50 text-amber-700 ring-amber-200", icon: Clock },
  Responded: { className: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: CheckCircle2 },
};

function StatusBadge({ status }: { status: Status }) {
  const { className, icon: Icon } = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1", className)}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

function AdminEnquiriesPage() {
  const [filter, setFilter] = useState<Status | "All">("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = filter === "All" ? enquiries : enquiries.filter((e) => e.status === filter);
  const counts = { All: enquiries.length, New: enquiries.filter((e) => e.status === "New").length, "In Progress": enquiries.filter((e) => e.status === "In Progress").length, Responded: enquiries.filter((e) => e.status === "Responded").length };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
          <p className="mt-1 text-sm text-gray-500">Quote requests submitted via the website.</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["All", "New", "In Progress", "Responded"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              filter === s ? "bg-[#042045] text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
            )}
          >
            {s}
            <span className={cn("ml-2 rounded-full px-1.5 py-0.5 text-xs", filter === s ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500")}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Customer", "Destination", "Travel", "Party", "Budget", "Status", "Received", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 first:pl-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((e) => (
                <>
                  <tr key={e.id} className="transition-colors hover:bg-gray-50/60">
                    <td className="py-4 pl-6 pr-4">
                      <p className="font-semibold text-gray-900">{e.name}</p>
                      <p className="text-xs text-gray-400">{e.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-800">{e.destination}</p>
                      <p className="text-xs text-gray-400">{e.region} · {e.tripType}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      <p>{e.travelDate}</p>
                      <p className="text-xs text-gray-400">{e.nights} nights</p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {e.adults}A {e.children > 0 ? `· ${e.children}C` : ""}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">{e.budget}</td>
                    <td className="px-4 py-4"><StatusBadge status={e.status} /></td>
                    <td className="px-4 py-4 text-xs text-gray-400">{e.received}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50">Edit</button>
                        <button onClick={() => setExpandedId(expandedId === e.id ? null : e.id)} className="rounded-lg border border-gray-200 p-1 text-gray-400 hover:bg-gray-50">
                          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expandedId === e.id && "rotate-180")} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === e.id && (
                    <tr key={`${e.id}-expand`} className="bg-blue-50/40">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                          <div><p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Phone</p><p className="mt-1 text-gray-800">{e.phone}</p></div>
                          <div><p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Notes</p><p className="mt-1 text-gray-800">{e.notes || "—"}</p></div>
                          <div className="col-span-2 flex items-center gap-2">
                            <a href={`mailto:${e.email}`} className="rounded-lg bg-[#042045] px-4 py-2 text-xs font-semibold text-white hover:bg-[#042045]/90">Reply by email</a>
                            <a href={`https://wa.me/447700900000`} className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">WhatsApp</a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y divide-gray-100 md:hidden">
          {filtered.map((e) => (
            <div key={e.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{e.name}</p>
                  <p className="text-xs text-gray-400">{e.email}</p>
                </div>
                <StatusBadge status={e.status} />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                <span className="font-medium text-gray-700">{e.destination}</span>
                <span>{e.travelDate}</span>
                <span>{e.nights}n</span>
                <span>{e.budget}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <a href={`mailto:${e.email}`} className="rounded-lg bg-[#042045] px-3 py-1.5 text-xs font-semibold text-white">Reply</a>
                <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
