import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { api } from "@/lib/api";
import { Pagination } from "@/components/ui/Pagination";

export const Route = createFileRoute("/admin/destination-highlights")({
  component: AdminDestinationHighlightsPage,
});

type DbHighlight = {
  id: number;
  image: string;
  country: string;
  city: string;
  type: string;
  sortOrder: number;
};

type DbHolidayType = { id: number; name: string };

const inputCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#042045] focus:bg-white focus:ring-2 focus:ring-[#042045]/10";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

const emptyForm = { image: "", country: "", city: "", type: "", sortOrder: 0 };

function AdminDestinationHighlightsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const { data: result, isLoading } = useQuery({
    queryKey: ["destination-highlights", page],
    queryFn: () => api.getPaged<DbHighlight>("/api/destination-highlights", page),
  });
  const items = result?.data ?? [];
  const total = result?.total ?? 0;

  const { data: holidayTypes } = useQuery({
    queryKey: ["holidays", "all"],
    queryFn: () => api.get<DbHolidayType[]>("/api/holidays"),
  });
  const typeOptions = [...new Set((holidayTypes ?? []).map((h) => h.name)), "Other"];

  const saveMut = useMutation({
    mutationFn: (data: typeof emptyForm) =>
      editId !== null
        ? api.patch(`/api/destination-highlights/${editId}`, data)
        : api.post("/api/destination-highlights", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["destination-highlights"] }); setModal(null); },
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/api/destination-highlights/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["destination-highlights"] }); setDeleteId(null); },
  });

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModal("add"); };
  const openEdit = (h: DbHighlight) => {
    setEditId(h.id);
    setForm({ image: h.image, country: h.country, city: h.city, type: h.type, sortOrder: h.sortOrder });
    setModal("edit");
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Destinations</h1>
          <p className="mt-1 text-sm text-gray-500">
            {items.length} destination highlights shown in the homepage carousel. Image, country, city and type only — these don't link to a page.
          </p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90">
          <Plus className="h-4 w-4" />Add destination
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
      ) : (
        <>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((h) => (
            <div key={h.id} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
              <div className="relative h-32 overflow-hidden bg-gray-100">
                {h.image && <img src={h.image} alt={h.city} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2.5 left-3">
                  <p className="text-sm font-bold text-white">{h.city}</p>
                  <p className="text-xs text-white/70">{h.country}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="rounded-full bg-[#042045]/8 px-2.5 py-0.5 text-xs font-medium text-[#042045]">{h.type}</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEdit(h)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => setDeleteId(h.id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination page={page} total={total} limit={50} onChange={setPage} className="mt-4" />
        </>
      )}

      {/* Add / Edit modal */}
      <Dialog open={modal !== null} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{modal === "add" ? "Add destination" : "Edit destination"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <ImageUpload label="Image" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>City</label><input className={inputCls} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
              <div><label className={labelCls}>Country</label><input className={inputCls} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="">Select a type</option>
                {typeOptions.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          {saveMut.error && <p className="text-sm text-red-600">{(saveMut.error as Error).message}</p>}
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button onClick={() => saveMut.mutate(form)} disabled={saveMut.isPending} className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white hover:bg-[#042045]/90 disabled:opacity-60">
              {saveMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete modal */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete destination?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">This will remove it from the homepage carousel.</p>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button onClick={() => deleteId !== null && deleteMut.mutate(deleteId)} disabled={deleteMut.isPending} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
              {deleteMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
