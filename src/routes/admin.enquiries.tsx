import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, CheckCircle2, Circle, ChevronDown, Pencil, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/enquiries")({
  component: AdminEnquiriesPage,
});

type Status = "New" | "In Progress" | "Responded";

type Enquiry = {
  id: number; name: string; email: string; phone: string;
  destination: string; region: string; tripType: string;
  travelDate: string; nights: number; adults: number; children: number;
  budget: string; status: Status; received: string; notes: string;
};

type DbEnquiry = {
  id: number; name: string; email: string; phone: string;
  destination: string; region: string | null; tripType: string;
  dateMode: string; departWindow: string | null; departDate: string | null;
  nights: number; adults: number; children: number;
  budget: string; status: string; notes: string | null; createdAt: string;
};

function dbStatusToUI(s: string): Status {
  if (s === "in_progress") return "In Progress";
  if (s === "responded") return "Responded";
  return "New";
}

function uiStatusToDb(s: Status): string {
  if (s === "In Progress") return "in_progress";
  if (s === "Responded") return "responded";
  return "new";
}

function toUIEnquiry(row: DbEnquiry): Enquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    destination: row.destination,
    region: row.region ?? "",
    tripType: row.tripType,
    travelDate: row.departDate ?? row.departWindow ?? "",
    nights: row.nights,
    adults: row.adults,
    children: row.children,
    budget: row.budget,
    status: dbStatusToUI(row.status),
    received: new Date(row.createdAt).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    }),
    notes: row.notes ?? "",
  };
}

const statusConfig: Record<Status, { className: string; icon: typeof Circle }> = {
  New: { className: "bg-blue-50 text-blue-700 ring-blue-200", icon: Circle },
  "In Progress": { className: "bg-amber-50 text-amber-700 ring-amber-200", icon: Clock },
  Responded: { className: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: CheckCircle2 },
};

function StatusBadge({ status }: { status: Status }) {
  const { className, icon: Icon } = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1", className)}>
      <Icon className="h-3 w-3" />{status}
    </span>
  );
}

const inputCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#042045] focus:bg-white focus:ring-2 focus:ring-[#042045]/10";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

function AdminEnquiriesPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Status | "All">("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<Enquiry | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["enquiries"],
    queryFn: () => api.get<DbEnquiry[]>("/api/enquiries").then((rows) => rows.map(toUIEnquiry)),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: Status }) =>
      api.patch(`/api/enquiries/${id}`, { status: uiStatusToDb(status) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enquiries"] }),
  });

  const saveEdit = useMutation({
    mutationFn: (e: Enquiry) =>
      api.patch(`/api/enquiries/${e.id}`, {
        status: uiStatusToDb(e.status),
        notes: e.notes,
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["enquiries"] }); setEditItem(null); },
  });

  const deleteEnquiry = useMutation({
    mutationFn: (id: number) => api.delete(`/api/enquiries/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enquiries"] });
      setDeleteId(null);
      if (expandedId === deleteId) setExpandedId(null);
    },
  });

  const filtered = filter === "All" ? items : items.filter((e) => e.status === filter);
  const counts = {
    All: items.length,
    New: items.filter((e) => e.status === "New").length,
    "In Progress": items.filter((e) => e.status === "In Progress").length,
    Responded: items.filter((e) => e.status === "Responded").length,
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
        <p className="mt-1 text-sm text-gray-500">Quote requests submitted via the website.</p>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["All", "New", "In Progress", "Responded"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              filter === s ? "bg-[#042045] text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50")}
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
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 first:pl-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((e) => (
                <>
                  <tr key={e.id} className="transition-colors hover:bg-gray-50/40">
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
                    <td className="px-4 py-4 text-gray-600">{e.adults}A{e.children > 0 ? ` · ${e.children}C` : ""}</td>
                    <td className="px-4 py-4 font-medium text-gray-700">{e.budget}</td>
                    <td className="px-4 py-4">
                      <select
                        value={e.status}
                        onChange={(ev) => updateStatus.mutate({ id: e.id, status: ev.target.value as Status })}
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 outline-none focus:border-[#042045] focus:ring-1 focus:ring-[#042045]/20 cursor-pointer"
                      >
                        <option>New</option>
                        <option>In Progress</option>
                        <option>Responded</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-400">{e.received}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setEditItem({ ...e })} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setDeleteId(e.id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setExpandedId(expandedId === e.id ? null : e.id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50">
                          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expandedId === e.id && "rotate-180")} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === e.id && (
                    <tr key={`${e.id}-exp`} className="bg-blue-50/30">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                          <div><p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Phone</p><p className="mt-1 text-gray-800">{e.phone}</p></div>
                          <div><p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Notes</p><p className="mt-1 text-gray-800">{e.notes || "-"}</p></div>
                          <div className="col-span-2 flex items-center gap-2">
                            <a href={`mailto:${e.email}`} className="rounded-lg bg-[#042045] px-4 py-2 text-xs font-semibold text-white hover:bg-[#042045]/90">Reply by email</a>
                            <a href={`https://wa.me/${e.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">WhatsApp</a>
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
                <div><p className="font-semibold text-gray-900">{e.name}</p><p className="text-xs text-gray-400">{e.email}</p></div>
                <StatusBadge status={e.status} />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                <span className="font-medium text-gray-700">{e.destination}</span>
                <span>{e.travelDate}</span><span>{e.nights}n</span><span>{e.budget}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <a href={`mailto:${e.email}`} className="rounded-lg bg-[#042045] px-3 py-1.5 text-xs font-semibold text-white">Reply</a>
                <button onClick={() => setEditItem({ ...e })} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600">Edit</button>
                <button onClick={() => setDeleteId(e.id)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit modal */}
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Enquiry</DialogTitle></DialogHeader>
          {editItem && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Name</label><input className={inputCls} value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} /></div>
                <div><label className={labelCls}>Email</label><input className={inputCls} value={editItem.email} onChange={(e) => setEditItem({ ...editItem, email: e.target.value })} /></div>
                <div><label className={labelCls}>Phone</label><input className={inputCls} value={editItem.phone} onChange={(e) => setEditItem({ ...editItem, phone: e.target.value })} /></div>
                <div><label className={labelCls}>Destination</label><input className={inputCls} value={editItem.destination} onChange={(e) => setEditItem({ ...editItem, destination: e.target.value })} /></div>
                <div><label className={labelCls}>Travel Date</label><input className={inputCls} value={editItem.travelDate} onChange={(e) => setEditItem({ ...editItem, travelDate: e.target.value })} /></div>
                <div><label className={labelCls}>Nights</label><input type="number" className={inputCls} value={editItem.nights} onChange={(e) => setEditItem({ ...editItem, nights: +e.target.value })} /></div>
                <div><label className={labelCls}>Adults</label><input type="number" className={inputCls} value={editItem.adults} onChange={(e) => setEditItem({ ...editItem, adults: +e.target.value })} /></div>
                <div><label className={labelCls}>Children</label><input type="number" className={inputCls} value={editItem.children} onChange={(e) => setEditItem({ ...editItem, children: +e.target.value })} /></div>
                <div><label className={labelCls}>Budget</label><input className={inputCls} value={editItem.budget} onChange={(e) => setEditItem({ ...editItem, budget: e.target.value })} /></div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select className={inputCls} value={editItem.status} onChange={(e) => setEditItem({ ...editItem, status: e.target.value as Status })}>
                    <option>New</option><option>In Progress</option><option>Responded</option>
                  </select>
                </div>
              </div>
              <div><label className={labelCls}>Notes</label><textarea className={inputCls} rows={3} value={editItem.notes} onChange={(e) => setEditItem({ ...editItem, notes: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button
              onClick={() => editItem && saveEdit.mutate(editItem)}
              disabled={saveEdit.isPending}
              className="rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white hover:bg-[#042045]/90 disabled:opacity-60"
            >
              {saveEdit.isPending ? "Saving…" : "Save changes"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete modal */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete enquiry?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">This will remove the enquiry from the dashboard. This action cannot be undone.</p>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button
              onClick={() => deleteId !== null && deleteEnquiry.mutate(deleteId)}
              disabled={deleteEnquiry.isPending}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleteEnquiry.isPending ? "Deleting…" : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
