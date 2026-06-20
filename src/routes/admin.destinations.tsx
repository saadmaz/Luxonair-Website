import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { destinations as initialDestinations } from "@/data/destinations";
import type { Destination } from "@/types/destination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/destinations")({
  component: AdminDestinationsPage,
});

type DestinationItem = Omit<Destination, "itinerary" | "highlights" | "gallery"> & { id: string };

const toItem = (d: Destination): DestinationItem => ({
  id: d.slug, slug: d.slug, name: d.name, country: d.country, region: d.region,
  tripType: d.tripType, budgetBand: d.budgetBand, fromPrice: d.fromPrice,
  durationNights: d.durationNights, heroImage: d.heroImage,
  tagline: d.tagline, summary: d.summary,
});

const inputCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#042045] focus:bg-white focus:ring-2 focus:ring-[#042045]/10";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

const regions = ["Europe", "Caribbean", "Indian Ocean", "Asia", "Americas", "Middle East"];
const budgetBands = ["££", "£££", "££££", "£££££"];
const tripTypeOptions = ["Family", "Business", "Honeymoon", "Luxury", "City Break", "Couples"];

const emptyForm: Omit<DestinationItem, "id"> = {
  slug: "", name: "", country: "", region: "Europe", tripType: ["Luxury" as any],
  budgetBand: "£££" as any, fromPrice: 0, durationNights: 7,
  heroImage: "", tagline: "", summary: "",
};

function AdminDestinationsPage() {
  const [items, setItems] = useState<DestinationItem[]>(initialDestinations.map(toItem));
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<DestinationItem, "id">>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  const openAdd = () => { setForm(emptyForm); setModal("add"); };
  const openEdit = (item: DestinationItem) => {
    const { id, ...rest } = item;
    setEditId(id); setForm(rest); setModal("edit");
  };
  const handleSave = () => {
    if (modal === "add") {
      setItems((prev) => [...prev, { ...form, id: form.slug || String(Date.now()) }]);
    } else if (editId) {
      setItems((prev) => prev.map((i) => (i.id === editId ? { ...form, id: editId } : i)));
    }
    setModal(null);
  };
  const confirmDelete = () => {
    if (deleteId == null) return;
    setItems((prev) => prev.filter((i) => i.id !== deleteId));
    setDeleteId(null);
  };

  const toggleTripType = (t: string) => {
    const current = form.tripType as string[];
    setForm({ ...form, tripType: (current.includes(t) ? current.filter((x) => x !== t) : [...current, t]) as any });
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Destinations</h1>
          <p className="mt-1 text-sm text-gray-500">{items.length} destinations on the site.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90">
          <Plus className="h-4 w-4" />Add destination
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((d) => (
          <div key={d.id} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="relative h-40 overflow-hidden bg-gray-100">
              {d.heroImage ? (
                <img src={d.heroImage} alt={d.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <div className="h-full w-full bg-gray-200" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">{d.region}</span>
                <span className="text-sm font-bold text-white">from £{d.fromPrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 leading-snug">{d.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-gray-500">{d.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(d.tripType as string[]).map((t) => (
                  <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">{t}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-400">{d.durationNights} nights · {d.budgetBand}</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEdit(d)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => setDeleteId(d.id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add modal */}
      <Dialog open={modal !== null} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{modal === "add" ? "Add destination" : "Edit destination"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><label className={labelCls}>Name</label><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>Country</label><input className={inputCls} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
              <div>
                <label className={labelCls}>Region</label>
                <select className={inputCls} value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value as any })}>
                  {regions.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>From price (£)</label><input type="number" className={inputCls} value={form.fromPrice} onChange={(e) => setForm({ ...form, fromPrice: +e.target.value })} /></div>
              <div><label className={labelCls}>Duration (nights)</label><input type="number" className={inputCls} value={form.durationNights} onChange={(e) => setForm({ ...form, durationNights: +e.target.value })} /></div>
              <div>
                <label className={labelCls}>Budget band</label>
                <select className={inputCls} value={form.budgetBand} onChange={(e) => setForm({ ...form, budgetBand: e.target.value as any })}>
                  {budgetBands.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Trip types</label>
              <div className="flex flex-wrap gap-2">
                {tripTypeOptions.map((t) => (
                  <button key={t} type="button" onClick={() => toggleTripType(t)}
                    className={cn("rounded-full px-3 py-1 text-xs font-medium transition-colors", (form.tripType as string[]).includes(t) ? "bg-[#042045] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div><label className={labelCls}>Tagline</label><input className={inputCls} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
            <div><label className={labelCls}>Summary</label><textarea className={inputCls} rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></div>
            <ImageUpload label="Hero image" value={form.heroImage} onChange={(url) => setForm({ ...form, heroImage: url })} />
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
          <DialogHeader><DialogTitle>Delete destination?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">This will remove the destination from the site. This cannot be undone.</p>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
