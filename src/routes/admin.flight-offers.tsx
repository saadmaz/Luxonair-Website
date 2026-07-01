import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, PlaneTakeoff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { api } from "@/lib/api";
import { Pagination } from "@/components/ui/Pagination";

export const Route = createFileRoute("/admin/flight-offers")({
  component: AdminFlightOffersPage,
});

type DbFlightOffer = {
  id: string;
  cabinClass: "Business" | "Economy";
  fromCity: string;
  fromCountry: string;
  toCity: string;
  toCountry: string;
  airlineName: string;
  airlineLogo: string;
  price: number;
  image: string;
  featured: boolean;
  sortOrder: number;
};

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#042045] focus:bg-white focus:ring-2 focus:ring-[#042045]/10";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

const emptyForm = {
  id: "",
  cabinClass: "Economy" as "Business" | "Economy",
  fromCity: "",
  fromCountry: "",
  toCity: "",
  toCountry: "",
  airlineName: "",
  airlineLogo: "",
  price: 0,
  image: "",
  featured: false,
  sortOrder: 0,
};

function AdminFlightOffersPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const { data: result, isLoading } = useQuery({
    queryKey: ["flight-offers", page],
    queryFn: () => api.getPaged<DbFlightOffer>("/api/flight-offers", page),
  });
  const items = result?.data ?? [];
  const total = result?.total ?? 0;

  const saveMut = useMutation({
    mutationFn: (data: typeof emptyForm) =>
      editId !== null
        ? api.patch(`/api/flight-offers/${editId}`, data)
        : api.post("/api/flight-offers", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["flight-offers"] });
      setModal(null);
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/api/flight-offers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["flight-offers"] });
      setDeleteId(null);
    },
  });

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setModal("add");
  };
  const openEdit = (o: DbFlightOffer) => {
    setEditId(o.id);
    setForm({
      id: o.id,
      cabinClass: o.cabinClass,
      fromCity: o.fromCity,
      fromCountry: o.fromCountry,
      toCity: o.toCity,
      toCountry: o.toCountry,
      airlineName: o.airlineName,
      airlineLogo: o.airlineLogo,
      price: o.price,
      image: o.image,
      featured: o.featured,
      sortOrder: o.sortOrder,
    });
    setModal("edit");
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flight Offers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Business & economy fares shown on the home page and /flight-offers.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90"
        >
          <Plus className="h-4 w-4" />
          Add offer
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {["Route", "Cabin", "Airline", "Price", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 first:pl-6"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-gray-50/60">
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {o.image && (
                            <img
                              src={o.image}
                              alt={o.fromCity}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-snug">
                            {o.fromCity} → {o.toCity}
                          </p>
                          <p className="text-xs text-gray-400">
                            {o.fromCountry} → {o.toCountry}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${o.cabinClass === "Business" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}
                      >
                        {o.cabinClass}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-9 items-center justify-center overflow-hidden rounded border border-gray-200 bg-white">
                          {o.airlineLogo ? (
                            <img
                              src={o.airlineLogo}
                              alt={o.airlineName}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <PlaneTakeoff className="h-3 w-3 text-gray-300" />
                          )}
                        </div>
                        {o.airlineName}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      £{o.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(o)}
                          className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(o.id)}
                          className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-gray-100 md:hidden">
            {items.map((o) => (
              <div key={o.id} className="flex gap-3 px-5 py-4">
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {o.image && (
                    <img src={o.image} alt={o.fromCity} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 leading-snug truncate">
                    {o.fromCity} → {o.toCity}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {o.cabinClass} · {o.airlineName}
                  </p>
                  <p className="mt-1 text-sm font-bold text-gray-900">
                    £{o.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => openEdit(o)}
                    className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(o.id)}
                    className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} total={total} limit={50} onChange={setPage} />
        </div>
      )}

      {/* Add / Edit modal */}
      <Dialog open={modal !== null} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{modal === "add" ? "Add flight offer" : "Edit flight offer"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {modal === "add" && (
              <div>
                <label className={labelCls}>Offer ID (unique slug)</label>
                <input
                  className={inputCls}
                  placeholder="e.g. lhr-mad-economy"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>From city</label>
                <input
                  className={inputCls}
                  value={form.fromCity}
                  onChange={(e) => setForm({ ...form, fromCity: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>From country</label>
                <input
                  className={inputCls}
                  value={form.fromCountry}
                  onChange={(e) => setForm({ ...form, fromCountry: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>To city</label>
                <input
                  className={inputCls}
                  value={form.toCity}
                  onChange={(e) => setForm({ ...form, toCity: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>To country</label>
                <input
                  className={inputCls}
                  value={form.toCountry}
                  onChange={(e) => setForm({ ...form, toCountry: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Cabin class</label>
                <select
                  className={inputCls}
                  value={form.cabinClass}
                  onChange={(e) =>
                    setForm({ ...form, cabinClass: e.target.value as "Business" | "Economy" })
                  }
                >
                  <option>Economy</option>
                  <option>Business</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Price per person (£)</label>
                <input
                  type="number"
                  className={inputCls}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: +e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Airline name</label>
                <input
                  className={inputCls}
                  value={form.airlineName}
                  onChange={(e) => setForm({ ...form, airlineName: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Sort order</label>
                <input
                  type="number"
                  className={inputCls}
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: +e.target.value })}
                />
              </div>
            </div>
            <ImageUpload
              label="Airline logo"
              value={form.airlineLogo}
              onChange={(url) => setForm({ ...form, airlineLogo: url })}
            />
            <ImageUpload
              label="Card image"
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured
            </label>
          </div>
          {saveMut.error && (
            <p className="text-sm text-red-600">{(saveMut.error as Error).message}</p>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={() => saveMut.mutate(form)}
              disabled={saveMut.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white hover:bg-[#042045]/90 disabled:opacity-60"
            >
              {saveMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete modal */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete flight offer?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">This will remove the offer from the site.</p>
          <DialogFooter>
            <DialogClose asChild>
              <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={() => deleteId && deleteMut.mutate(deleteId)}
              disabled={deleteMut.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleteMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
