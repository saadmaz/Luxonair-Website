import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";

export const Route = createFileRoute("/admin/subscribers")({
  component: AdminSubscribersPage,
});

const subscribers = [
  { id: 1, email: "alice.jones@email.com", name: "Alice Jones", source: "Homepage", joined: "20 Jun 2025" },
  { id: 2, email: "ben.wright@gmail.com", name: "Ben Wright", source: "Quote form", joined: "19 Jun 2025" },
  { id: 3, email: "chloe.dasilva@email.com", name: "Chloe Da Silva", source: "Homepage", joined: "18 Jun 2025" },
  { id: 4, email: "d.armstrong@corp.co.uk", name: "David Armstrong", source: "Blog", joined: "17 Jun 2025" },
  { id: 5, email: "eleanor.m@outlook.com", name: "Eleanor Morrison", source: "Homepage", joined: "16 Jun 2025" },
  { id: 6, email: "frank.obi@email.com", name: "Frank Obi", source: "Deals page", joined: "15 Jun 2025" },
  { id: 7, email: "grace.liu@gmail.com", name: "Grace Liu", source: "Homepage", joined: "14 Jun 2025" },
  { id: 8, email: "harry.f@email.com", name: "Harry Fleming", source: "Quote form", joined: "13 Jun 2025" },
  { id: 9, email: "isla.b@email.com", name: "Isla Brennan", source: "Blog", joined: "12 Jun 2025" },
  { id: 10, email: "jack.hassan@gmail.com", name: "Jack Hassan", source: "Homepage", joined: "11 Jun 2025" },
  { id: 11, email: "katie.sun@email.com", name: "Katie Sun", source: "Deals page", joined: "10 Jun 2025" },
  { id: 12, email: "liam.o@outlook.com", name: "Liam O'Brien", source: "Homepage", joined: "9 Jun 2025" },
];

const sourceColors: Record<string, string> = {
  Homepage: "bg-blue-50 text-blue-700",
  "Quote form": "bg-violet-50 text-violet-700",
  Blog: "bg-emerald-50 text-emerald-700",
  "Deals page": "bg-amber-50 text-amber-700",
};

function AdminSubscribersPage() {
  const handleExport = () => {
    const csv = ["Name,Email,Source,Joined", ...subscribers.map((s) => `${s.name},${s.email},${s.source},${s.joined}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
          <p className="mt-1 text-sm text-gray-500">{subscribers.length} newsletter subscribers.</p>
        </div>
        <button onClick={handleExport} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Stats row */}
        <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100 md:grid-cols-4">
          {[
            { label: "Total", value: subscribers.length },
            { label: "This week", value: 8 },
            { label: "This month", value: 34 },
            { label: "Avg / week", value: "4.2" },
          ].map(({ label, value }) => (
            <div key={label} className="px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Name", "Email", "Source", "Joined", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 first:pl-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-gray-50/60">
                  <td className="py-3.5 pl-6 pr-4 font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3.5 text-gray-600">{s.email}</td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${sourceColors[s.source] ?? "bg-gray-100 text-gray-600"}`}>
                      {s.source}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-400">{s.joined}</td>
                  <td className="px-4 py-3.5">
                    <button className="text-xs font-medium text-red-400 hover:text-red-600">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y divide-gray-100 md:hidden">
          {subscribers.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm font-medium text-gray-900">{s.name}</p>
                <p className="text-xs text-gray-400">{s.email}</p>
              </div>
              <div className="text-right">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${sourceColors[s.source] ?? "bg-gray-100 text-gray-600"}`}>{s.source}</span>
                <p className="mt-0.5 text-[11px] text-gray-400">{s.joined}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
