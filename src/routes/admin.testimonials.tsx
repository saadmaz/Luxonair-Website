import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/testimonials")({
  component: AdminTestimonialsPage,
});

type DbTestimonial = {
  id: number;
  author: string;
  trip: string;
  rating: number;
  date: string;
  body: string;
};

const inputCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#042045] focus:bg-white focus:ring-2 focus:ring-[#042045]/10";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

const emptyForm = {
  author: "",
  trip: "",
  rating: 5 as 1 | 2 | 3 | 4 | 5,
  date: new Date().toISOString().slice(0, 10),
  body: "",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`h-3.5 w-3.5 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: 1 | 2 | 3 | 4 | 5) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n as 1 | 2 | 3 | 4 | 5)}
          className="transition-transform hover:scale-110"
        >
          <Star className={`h-7 w-7 transition-colors ${n <= (hovered || value) ? "fill-amber-400 text-amber-400" : "fill-none text-gray-300"}`} />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-500">{value} star{value !== 1 ? "s" : ""}</span>
    </div>
  );
}

function AdminTestimonialsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => api.get<DbTestimonial[]>("/api/testimonials"),
  });

  const saveMut = useMutation({
    mutationFn: (data: typeof emptyForm) =>
      editId !== null
        ? api.patch(`/api/testimonials/${editId}`, data)
        : api.post("/api/testimonials", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["testimonials"] }); setModal(null); },
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/api/testimonials/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["testimonials"] }); setDeleteId(null); },
  });

  const avg = items.length ? +(items.reduce((s, r) => s + r.rating, 0) / items.length).toFixed(1) : 0;

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModal("add"); };
  const openEdit = (r: DbTestimonial) => {
    setEditId(r.id);
    setForm({ author: r.author, trip: r.trip, rating: r.rating as 1|2|3|4|5, date: r.date, body: r.body });
    setModal("edit");
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="mt-1 text-sm text-gray-500">
            {items.length} reviews · Average{" "}
            <span className="font-semibold text-amber-600">{avg} / 5</span>
          </p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90">
          <Plus className="h-4 w-4" /> Add testimonial
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
      ) : (
        <>
          {/* Aggregate */}
          <div className="mb-6 flex items-center gap-6 rounded-xl border border-amber-100 bg-amber-50 px-6 py-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-amber-600">{avg}</p>
              <StarRating rating={Math.round(avg)} />
              <p className="mt-1 text-xs text-amber-700">{items.length} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const n = items.filter((r) => r.rating === star).length;
                const pct = items.length ? Math.round((n / items.length) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs text-amber-800">
                    <span className="w-4 text-right">{star}</span>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-amber-200">
                      <div className="h-full rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-6 text-right">{n}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((r) => (
              <div key={r.id} className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{r.author}</p>
                    <p className="text-xs text-gray-400">{r.trip}</p>
                  </div>
                  <StarRating rating={r.rating} />
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">"{r.body}"</p>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs text-gray-400">
                    {new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openEdit(r)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(r.id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add / Edit modal */}
      <Dialog open={modal !== null} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{modal === "add" ? "Add testimonial" : "Edit testimonial"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className={labelCls}>Author</label>
              <input className={inputCls} placeholder="e.g. Sarah & James M." value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Trip</label>
              <input className={inputCls} placeholder="e.g. Maldives honeymoon, 14 nights" value={form.trip} onChange={(e) => setForm({ ...form, trip: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Rating</label>
              <StarPicker value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Review text</label>
              <textarea className={inputCls} rows={4} placeholder="What did the client say?" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            </div>
          </div>
          {saveMut.error && <p className="text-sm text-red-600">{(saveMut.error as Error).message}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
            </DialogClose>
            <button onClick={() => saveMut.mutate(form)} disabled={saveMut.isPending} className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white hover:bg-[#042045]/90 disabled:opacity-60">
              {saveMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete modal */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete testimonial?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">This review will be permanently removed from the site.</p>
          <DialogFooter>
            <DialogClose asChild>
              <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
            </DialogClose>
            <button onClick={() => deleteId !== null && deleteMut.mutate(deleteId)} disabled={deleteMut.isPending} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
              {deleteMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
