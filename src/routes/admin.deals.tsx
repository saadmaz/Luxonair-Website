import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { deals as initialDeals } from "@/data/deals";
import type { Deal } from "@/types/deal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/deals")({
  component: AdminDealsPage,
});

type DealItem = Deal & { _id: string };

const toItem = (d: Deal): DealItem => ({ ...d, _id: d.id });

const inputCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#042045] focus:bg-white focus:ring-2 focus:ring-[#042045]/10";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

const regions = ["Europe", "Caribbean", "Indian Ocean", "Asia", "Americas", "Middle East"];
const boards = ["Room only", "B&B", "Half board", "Full board", "Premium AI", "Mixed"];
const badges = ["Honeymoon", "Family", "Corporate", "Couples", "Tailor-made", "City break", "Luxury"];

const emptyForm = {
  id: "", title: "", destinationSlug: "", region: "Europe", nights: 7,
  board: "B&B", fromPrice: 0, oldPrice: undefined as number | undefined,
  badge: "Honeymoon", expires: "", image: "", blurb: "",
};

function AdminDealsPage() {
  const [items, setItems] = useState<DealItem[]>(initialDeals.map(toItem));
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  const openAdd = () => { setForm(emptyForm); setModal("add"); };
  const openEdit = (item: DealItem) => {
    setEditId(item._id);
    setForm({ id: item.id, title: item.title, destinationSlug: item.destinationSlug, region: item.region, nights: item.nights, board: item.board, fromPrice: item.fromPrice, oldPrice: item.oldPrice, badge: item.badge, expires: item.expires, image: item.image, blurb: item.blurb });
    setModal("edit");
  };
  const handleSave = () => {
    if (modal === "add") {
      const newId = form.id || String(Date.now());
      setItems((prev) => [...prev, { ...form, id: newId, _id: newId }]);
    } else if (editId) {
      setItems((prev) => prev.map((i) => i._id === editId ? { ...form, _id: editId } : i));
    }
    setModal(null);
  };
  const confirmDelete = () => {
    if (!deleteId) return;
    setItems((prev) => prev.filter((i) => i._id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="mt-1 text-sm text-gray-500">{items.length} active deals on the site.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90">
          <Plus className="h-4 w-4" />Add deal
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Deal", "Region", "Nights", "Board", "Price", "Was", "Badge", "Expires", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 first:pl-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((d) => (
                <tr key={d._id} className="transition-colors hover:bg-gray-50/60">
                  <td className="py-4 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {d.image && <img src={d.image} alt={d.title} className="h-full w-full object-cover" />}
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
                  <td className="px-4 py-4 text-gray-400 line-through">{d.oldPrice ? `£${d.oldPrice.toLocaleString()}` : "—"}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#042045]/8 px-2.5 py-0.5 text-xs font-medium text-[#042045]">
                      <Tag className="h-3 w-3" />{d.badge}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-400">{new Date(d.expires).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(d)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setDeleteId(d._id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-gray-100 md:hidden">
          {items.map((d) => (
            <div key={d._id} className="flex gap-3 px-5 py-4">
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {d.image && <img src={d.image} alt={d.title} className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-snug truncate">{d.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{d.nights}n · {d.board} · {d.region}</p>
                <p className="mt-1 text-sm font-bold text-gray-900">£{d.fromPrice.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <button onClick={() => openEdit(d)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => setDeleteId(d._id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit modal */}
      <Dialog open={modal !== null} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{modal === "add" ? "Add deal" : "Edit deal"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><label className={labelCls}>Title</label><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Region</label>
                <select className={inputCls} value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
                  {regions.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Nights</label><input type="number" className={inputCls} value={form.nights} onChange={(e) => setForm({ ...form, nights: +e.target.value })} /></div>
              <div>
                <label className={labelCls}>Board</label>
                <select className={inputCls} value={form.board} onChange={(e) => setForm({ ...form, board: e.target.value })}>
                  {boards.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Badge</label>
                <select className={inputCls} value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}>
                  {badges.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>From price (£)</label><input type="number" className={inputCls} value={form.fromPrice} onChange={(e) => setForm({ ...form, fromPrice: +e.target.value })} /></div>
              <div><label className={labelCls}>Was price (£, optional)</label><input type="number" className={inputCls} value={form.oldPrice ?? ""} onChange={(e) => setForm({ ...form, oldPrice: e.target.value ? +e.target.value : undefined })} /></div>
              <div><label className={labelCls}>Expires</label><input type="date" className={inputCls} value={form.expires} onChange={(e) => setForm({ ...form, expires: e.target.value })} /></div>
            </div>
            <div><label className={labelCls}>Blurb</label><textarea className={inputCls} rows={2} value={form.blurb} onChange={(e) => setForm({ ...form, blurb: e.target.value })} /></div>
            <div><label className={labelCls}>Image URL</label><input className={inputCls} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button onClick={handleSave} className="rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white hover:bg-[#042045]/90">Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete modal */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete deal?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">This will remove the deal from the site.</p>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
