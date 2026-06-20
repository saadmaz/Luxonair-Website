import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { holidayTypes as initialHolidays } from "@/data/holidayTypes";
import type { HolidayType } from "@/types/holiday-type";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/holidays")({
  component: AdminHolidaysPage,
});

type HolidayItem = HolidayType & { _id: string };

const toItem = (h: HolidayType): HolidayItem => ({ ...h, _id: h.slug });

const inputCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#042045] focus:bg-white focus:ring-2 focus:ring-[#042045]/10";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

const emptyForm = { slug: "", name: "", tagline: "", summary: "", heroImage: "", bullets: ["", "", "", ""], destinationSlugs: [] as string[] };

type FormState = typeof emptyForm;

const itemToForm = (h: HolidayItem): FormState => ({
  slug: h.slug, name: h.name, tagline: h.tagline, summary: h.summary,
  heroImage: h.heroImage,
  bullets: [...h.bullets, "", "", "", ""].slice(0, 4) as string[],
  destinationSlugs: [...h.destinationSlugs] as string[],
});

function AdminHolidaysPage() {
  const [items, setItems] = useState<HolidayItem[]>(initialHolidays.map(toItem));
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  const openAdd = () => { setForm(emptyForm); setModal("add"); };
  const openEdit = (item: HolidayItem) => { setEditId(item._id); setForm(itemToForm(item)); setModal("edit"); };

  const handleSave = () => {
    const bullets = (form.bullets as string[]).filter((b) => b.trim()) as readonly string[];
    if (modal === "add") {
      const id = form.slug || String(Date.now());
      setItems((prev) => [...prev, { ...form, bullets, _id: id }]);
    } else if (editId) {
      setItems((prev) => prev.map((i) => i._id === editId ? { ...form, bullets, _id: editId } : i));
    }
    setModal(null);
  };
  const confirmDelete = () => {
    if (!deleteId) return;
    setItems((prev) => prev.filter((i) => i._id !== deleteId));
    setDeleteId(null);
  };

  const setBullet = (index: number, value: string) => {
    const next = [...(form.bullets as string[])];
    next[index] = value;
    setForm({ ...form, bullets: next });
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Holiday Types</h1>
          <p className="mt-1 text-sm text-gray-500">{items.length} holiday categories on the site.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90">
          <Plus className="h-4 w-4" />Add holiday type
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((h) => (
          <div key={h._id} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="relative h-36 overflow-hidden bg-gray-100">
              {h.heroImage && <img src={h.heroImage} alt={h.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-lg font-bold text-white">{h.name}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs font-medium text-[#042045]/70 italic">"{h.tagline}"</p>
              <p className="mt-2 line-clamp-2 text-xs text-gray-500">{h.summary}</p>
              <div className="mt-3 space-y-1">
                {(h.bullets as string[]).map((b) => (
                  <div key={b} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="h-1 w-1 rounded-full bg-[#042045]/40 shrink-0" />{b}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-400">{h.destinationSlugs.length} destination{h.destinationSlugs.length !== 1 ? "s" : ""} linked</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEdit(h)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => setDeleteId(h._id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit modal */}
      <Dialog open={modal !== null} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{modal === "add" ? "Add holiday type" : "Edit holiday type"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>Name</label><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><label className={labelCls}>Slug</label><input className={inputCls} placeholder="e.g. beach" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            </div>
            <div><label className={labelCls}>Tagline</label><input className={inputCls} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
            <div><label className={labelCls}>Summary</label><textarea className={inputCls} rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></div>
            <div>
              <label className={labelCls}>Bullet points (up to 4)</label>
              <div className="space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <input key={i} className={inputCls} placeholder={`Bullet ${i + 1}`} value={(form.bullets as string[])[i] ?? ""} onChange={(e) => setBullet(i, e.target.value)} />
                ))}
              </div>
            </div>
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
          <DialogHeader><DialogTitle>Delete holiday type?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">This will remove the category from the site.</p>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
