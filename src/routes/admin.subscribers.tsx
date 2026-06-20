import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/subscribers")({
  component: AdminSubscribersPage,
});

type Subscriber = { id: number; email: string; name: string; source: string; joined: string };

const initialData: Subscriber[] = [
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

const inputCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#042045] focus:bg-white focus:ring-2 focus:ring-[#042045]/10";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

const emptyForm = { name: "", email: "", source: "Homepage" };

function AdminSubscribersPage() {
  const [items, setItems] = useState<Subscriber[]>(initialData);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const confirmDelete = () => {
    if (deleteId == null) return;
    setItems((prev) => prev.filter((s) => s.id !== deleteId));
    setDeleteId(null);
  };

  const handleAdd = () => {
    if (!form.email.trim()) return;
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    setItems((prev) => [...prev, { id: Date.now(), name: form.name, email: form.email, source: form.source, joined: today }]);
    setForm(emptyForm);
    setAddOpen(false);
  };

  const handleExport = () => {
    const csv = ["Name,Email,Source,Joined", ...items.map((s) => `${s.name},${s.email},${s.source},${s.joined}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
          <p className="mt-1 text-sm text-gray-500">{items.length} newsletter subscribers.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Download className="h-4 w-4" />Export CSV
          </button>
          <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90">
            <Plus className="h-4 w-4" />Add subscriber
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100 md:grid-cols-4">
          {[{ label: "Total", value: items.length }, { label: "This week", value: 8 }, { label: "This month", value: 34 }, { label: "Avg / week", value: "4.2" }].map(({ label, value }) => (
            <div key={label} className="px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Name", "Email", "Source", "Joined", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 first:pl-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-gray-50/60">
                  <td className="py-3.5 pl-6 pr-4 font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3.5 text-gray-600">{s.email}</td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${sourceColors[s.source] ?? "bg-gray-100 text-gray-600"}`}>{s.source}</span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-400">{s.joined}</td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => setDeleteId(s.id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-gray-100 md:hidden">
          {items.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm font-medium text-gray-900">{s.name}</p>
                <p className="text-xs text-gray-400">{s.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${sourceColors[s.source] ?? "bg-gray-100 text-gray-600"}`}>{s.source}</span>
                <button onClick={() => setDeleteId(s.id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add modal */}
      <Dialog open={addOpen} onOpenChange={(o) => { if (!o) { setAddOpen(false); setForm(emptyForm); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add subscriber</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><label className={labelCls}>Name</label><input className={inputCls} placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className={labelCls}>Email *</label><input type="email" className={inputCls} placeholder="email@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div>
              <label className={labelCls}>Source</label>
              <select className={inputCls} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                <option>Homepage</option><option>Quote form</option><option>Blog</option><option>Deals page</option><option>Manual</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button onClick={handleAdd} className="rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white hover:bg-[#042045]/90">Add</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete modal */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Remove subscriber?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">They will no longer receive newsletter emails.</p>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Remove</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
