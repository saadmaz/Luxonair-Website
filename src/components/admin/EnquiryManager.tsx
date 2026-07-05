// Shared admin UI for the two separate enquiry tables (enquiry_packages /
// enquiry_flights). The two routes render this with `kind` set accordingly —
// see src/routes/admin.enquiry-packages.tsx and admin.enquiry-flights.tsx.
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Pencil, Trash2, Loader2, Mail } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { cn } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { NotesLog } from "@/components/admin/NotesLog";
import type { NoteEntry, NoteType } from "@/lib/notes";
import { ENQUIRY_STATUSES, ENQUIRY_STATUS_LABELS, ENQUIRY_STATUS_COLORS, type EnquiryStatus } from "@/lib/enquiry-status";

type Kind = "package" | "flight";

type Enquiry = {
  id: number; name: string; email: string; phone: string;
  destination: string; region: string; tripType: string;
  travelDate: string; dateMode: string; nights: number | null; adults: number; children: number; infants: number;
  budget: string; status: EnquiryStatus; received: string; notes: string;
  hotelRating: string; boardBasis: string; flightsIncluded: boolean;
  cabinClass: string; departAirport: string; directOnly: string; preferredAirlines: string;
};

type DbEnquiry = {
  id: number; name: string; email: string; phone: string;
  destination: string; region: string | null; tripType: string;
  dateMode: string; departWindow: string | null; departDate: string | null;
  nights: number | null; adults: number; children: number; infants: number;
  budget: string; status: EnquiryStatus; notes: string | null; createdAt: string;
  hotelRating: string | null; boardBasis: string | null; flightsIncluded: boolean | null;
  cabinClass: string | null; departAirport: string | null; directOnly: string | null; preferredAirlines: string | null;
};

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
    dateMode: row.dateMode,
    nights: row.nights,
    adults: row.adults,
    children: row.children,
    infants: row.infants,
    budget: row.budget,
    status: row.status,
    received: new Date(row.createdAt).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    }),
    notes: row.notes ?? "",
    hotelRating: row.hotelRating ?? "",
    boardBasis: row.boardBasis ?? "",
    flightsIncluded: row.flightsIncluded ?? false,
    cabinClass: row.cabinClass ?? "",
    departAirport: row.departAirport ?? "",
    directOnly: row.directOnly ?? "",
    preferredAirlines: row.preferredAirlines ?? "",
  };
}

function StatusBadge({ status }: { status: EnquiryStatus }) {
  const { className, dot } = ENQUIRY_STATUS_COLORS[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />{ENQUIRY_STATUS_LABELS[status]}
    </span>
  );
}

function StatusSelect({ value, onChange, className }: { value: EnquiryStatus; onChange: (v: EnquiryStatus) => void; className?: string }) {
  return (
    <select
      value={value}
      onChange={(ev) => onChange(ev.target.value as EnquiryStatus)}
      className={className}
    >
      {ENQUIRY_STATUSES.map((s) => (
        <option key={s} value={s}>{ENQUIRY_STATUS_LABELS[s]}</option>
      ))}
    </select>
  );
}

const inputCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#042045] focus:bg-white focus:ring-2 focus:ring-[#042045]/10";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

export function EnquiryManager({ kind }: { kind: Kind }) {
  const apiBase = kind === "package" ? "/api/enquiry-packages" : "/api/enquiry-flights";
  const queryKey = kind === "package" ? "enquiry-packages" : "enquiry-flights";
  const title = kind === "package" ? "Package Enquiries" : "Flight Enquiries";
  const description = kind === "package"
    ? "Holiday package quote requests submitted via the website."
    : "Flight-only quote requests submitted via the website.";

  const qc = useQueryClient();
  const [filter, setFilter] = useState<EnquiryStatus | "All">("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<Enquiry | null>(null);
  const [saveError, setSaveError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [replyItem, setReplyItem] = useState<Enquiry | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  const { data: items = [], isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: () => api.get<DbEnquiry[]>(apiBase).then((rows) => rows.map(toUIEnquiry)),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: EnquiryStatus }) =>
      api.patch(`${apiBase}/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }),
  });

  const saveEdit = useMutation({
    mutationFn: (e: Enquiry) =>
      api.patch(`${apiBase}/${e.id}`, {
        status: e.status,
        name: e.name,
        email: e.email,
        phone: e.phone,
        destination: e.destination,
        // travelDate is a merged display field backed by either departDate
        // (fixed dates) or departWindow (flexible dates) — write back to
        // whichever one this enquiry actually used.
        ...(e.dateMode === "specific" ? { departDate: e.travelDate } : { departWindow: e.travelDate }),
        ...(kind === "package" ? { nights: e.nights ?? 1 } : {}),
        adults: e.adults,
        children: e.children,
        infants: e.infants,
        budget: e.budget,
        ...(kind === "package"
          ? { hotelRating: e.hotelRating, boardBasis: e.boardBasis, flightsIncluded: e.flightsIncluded }
          : { cabinClass: e.cabinClass, departAirport: e.departAirport, directOnly: e.directOnly, preferredAirlines: e.preferredAirlines }),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); setEditItem(null); },
    onError: () => setSaveError("Failed to save changes. Please try again."),
  });

  const { data: notes = [] } = useQuery({
    queryKey: [`${queryKey}-notes`, editItem?.id],
    queryFn: () => api.get<NoteEntry[]>(`${apiBase}/${editItem!.id}/notes`),
    enabled: editItem !== null,
  });

  const addNote = useMutation({
    mutationFn: (vars: { id: number; body: string; type: NoteType }) =>
      api.post<NoteEntry>(`${apiBase}/${vars.id}/notes`, { body: vars.body, type: vars.type }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [`${queryKey}-notes`, vars.id] });
    },
  });

  const deleteEnquiry = useMutation({
    mutationFn: (id: number) => api.delete(`${apiBase}/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
      setDeleteId(null);
      if (expandedId === deleteId) setExpandedId(null);
    },
  });

  const sendReply = useMutation({
    mutationFn: (vars: { id: number; subject: string; message: string }) =>
      api.post(`${apiBase}/${vars.id}/reply`, { subject: vars.subject, message: vars.message }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
      setReplyItem(null);
    },
  });

  const openReply = (e: Enquiry) => {
    setReplyItem(e);
    setReplySubject(`Your ${e.destination} enquiry — Luxeonair`);
    setReplyMessage("");
  };

  const filtered = filter === "All" ? items : items.filter((e) => e.status === filter);
  const counts: Record<EnquiryStatus | "All", number> = {
    All: items.length,
    new: items.filter((e) => e.status === "new").length,
    contacted: items.filter((e) => e.status === "contacted").length,
    in_progress: items.filter((e) => e.status === "in_progress").length,
    closed_won: items.filter((e) => e.status === "closed_won").length,
    closed_lost: items.filter((e) => e.status === "closed_lost").length,
    no_response: items.filter((e) => e.status === "no_response").length,
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
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      {/* Status filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["All", ...ENQUIRY_STATUSES] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              filter === s ? "bg-[#042045] text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50")}
          >
            {s === "All" ? "All" : ENQUIRY_STATUS_LABELS[s]}
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
                {[kind === "flight" ? "Route" : "Destination", "Customer", "Travel", "Party", "Budget", "Status", "Received", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 first:pl-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((e) => (
                <>
                  <tr key={e.id} className="transition-colors hover:bg-gray-50/40">
                    <td className="py-4 pl-6 pr-4">
                      {kind === "flight" ? (
                        <>
                          <p className="font-medium text-gray-800">{e.departAirport} → {e.destination}</p>
                          <p className="text-xs text-gray-400">{e.tripType}{e.cabinClass ? ` · ${e.cabinClass}` : ""}</p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-gray-800">{e.destination}</p>
                          <p className="text-xs text-gray-400">{[e.region, e.tripType].filter(Boolean).join(" · ")}</p>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">{e.name}</p>
                      <p className="text-xs text-gray-400">{e.email}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      <p>{e.travelDate}</p>
                      {e.nights !== null && <p className="text-xs text-gray-400">{e.nights} nights</p>}
                    </td>
                    <td className="px-4 py-4 text-gray-600">{e.adults}A{e.children > 0 ? ` · ${e.children}C` : ""}{e.infants > 0 ? ` · ${e.infants}I` : ""}</td>
                    <td className="px-4 py-4 font-medium text-gray-700">{e.budget}</td>
                    <td className="px-4 py-4">
                      <StatusSelect
                        value={e.status}
                        onChange={(status) => updateStatus.mutate({ id: e.id, status })}
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 outline-none focus:border-[#042045] focus:ring-1 focus:ring-[#042045]/20 cursor-pointer"
                      />
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
                          {kind === "package" ? (
                            <>
                              <div><p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Hotel / board</p><p className="mt-1 text-gray-800">{[e.hotelRating, e.boardBasis].filter(Boolean).join(" · ") || "-"}</p></div>
                              <div><p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Flights</p><p className="mt-1 text-gray-800">{e.flightsIncluded ? `${e.departAirport || "?"} · ${e.cabinClass || "?"}` : "Not required"}</p></div>
                            </>
                          ) : (
                            <>
                              <div><p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Routing</p><p className="mt-1 text-gray-800">{e.directOnly || "No preference"}</p></div>
                              <div><p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Preferred airlines</p><p className="mt-1 text-gray-800">{e.preferredAirlines || "-"}</p></div>
                            </>
                          )}
                          {e.notes && (
                            <div className="col-span-2 md:col-span-4"><p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Notes</p><p className="mt-1 text-gray-800">{e.notes}</p></div>
                          )}
                          <div className="col-span-2 flex items-center gap-2 md:col-span-4">
                            <button onClick={() => openReply(e)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#042045] px-4 py-2 text-xs font-semibold text-white hover:bg-[#042045]/90"><Mail className="h-3.5 w-3.5" />Reply by email</button>
                            <a href={`https://wa.me/${e.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"><WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />WhatsApp</a>
                            <button onClick={() => setEditItem({ ...e })} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"><Pencil className="h-3.5 w-3.5" />View activity log</button>
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
                <span className="font-medium text-gray-700">
                  {kind === "flight" ? `${e.departAirport} → ${e.destination}` : e.destination}
                </span>
                <span>{e.travelDate}</span>
                {e.nights !== null && <span>{e.nights}n</span>}
                <span>{e.budget}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => openReply(e)} className="rounded-lg bg-[#042045] px-3 py-1.5 text-xs font-semibold text-white">Reply</button>
                <button onClick={() => setEditItem({ ...e })} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600">Edit</button>
                <button onClick={() => setDeleteId(e.id)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit modal */}
      <Dialog open={!!editItem} onOpenChange={(o) => { if (!o) { setEditItem(null); setSaveError(""); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit {kind === "flight" ? "Flight" : "Package"} Enquiry</DialogTitle></DialogHeader>
          {editItem && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Name</label><input className={inputCls} value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} /></div>
                <div><label className={labelCls}>Email</label><input className={inputCls} value={editItem.email} onChange={(e) => setEditItem({ ...editItem, email: e.target.value })} /></div>
                <div><label className={labelCls}>Phone</label><input className={inputCls} value={editItem.phone} onChange={(e) => setEditItem({ ...editItem, phone: e.target.value })} /></div>
                <div><label className={labelCls}>{kind === "flight" ? "Arrival airport" : "Destination"}</label><input className={inputCls} value={editItem.destination} onChange={(e) => setEditItem({ ...editItem, destination: e.target.value })} /></div>
                <div><label className={labelCls}>Travel Date</label><input className={inputCls} value={editItem.travelDate} onChange={(e) => setEditItem({ ...editItem, travelDate: e.target.value })} /></div>
                {kind === "package" && (
                  <div><label className={labelCls}>Nights</label><input type="number" className={inputCls} value={editItem.nights ?? 0} onChange={(e) => setEditItem({ ...editItem, nights: +e.target.value })} /></div>
                )}
                <div><label className={labelCls}>Adults</label><input type="number" className={inputCls} value={editItem.adults} onChange={(e) => setEditItem({ ...editItem, adults: +e.target.value })} /></div>
                <div><label className={labelCls}>Children</label><input type="number" className={inputCls} value={editItem.children} onChange={(e) => setEditItem({ ...editItem, children: +e.target.value })} /></div>
                <div><label className={labelCls}>Infants</label><input type="number" className={inputCls} value={editItem.infants} onChange={(e) => setEditItem({ ...editItem, infants: +e.target.value })} /></div>
                <div><label className={labelCls}>Budget</label><input className={inputCls} value={editItem.budget} onChange={(e) => setEditItem({ ...editItem, budget: e.target.value })} /></div>
                <div>
                  <label className={labelCls}>Status</label>
                  <StatusSelect className={inputCls} value={editItem.status} onChange={(status) => setEditItem({ ...editItem, status })} />
                </div>
                {kind === "package" ? (
                  <>
                    <div><label className={labelCls}>Hotel rating</label><input className={inputCls} value={editItem.hotelRating} onChange={(e) => setEditItem({ ...editItem, hotelRating: e.target.value })} /></div>
                    <div><label className={labelCls}>Board basis</label><input className={inputCls} value={editItem.boardBasis} onChange={(e) => setEditItem({ ...editItem, boardBasis: e.target.value })} /></div>
                    <div>
                      <label className={labelCls}>Flights included</label>
                      <select className={inputCls} value={editItem.flightsIncluded ? "Yes" : "No"} onChange={(e) => setEditItem({ ...editItem, flightsIncluded: e.target.value === "Yes" })}>
                        <option>Yes</option><option>No</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div><label className={labelCls}>Departure airport</label><input className={inputCls} value={editItem.departAirport} onChange={(e) => setEditItem({ ...editItem, departAirport: e.target.value })} /></div>
                    <div><label className={labelCls}>Cabin class</label><input className={inputCls} value={editItem.cabinClass} onChange={(e) => setEditItem({ ...editItem, cabinClass: e.target.value })} /></div>
                    <div><label className={labelCls}>Routing preference</label><input className={inputCls} value={editItem.directOnly} onChange={(e) => setEditItem({ ...editItem, directOnly: e.target.value })} /></div>
                    <div><label className={labelCls}>Preferred airlines</label><input className={inputCls} value={editItem.preferredAirlines} onChange={(e) => setEditItem({ ...editItem, preferredAirlines: e.target.value })} /></div>
                  </>
                )}
              </div>
              <div>
                <label className={labelCls}>Activity log</label>
                <NotesLog
                  notes={notes}
                  isPending={addNote.isPending}
                  onAdd={(body, type) => editItem && addNote.mutate({ id: editItem.id, body, type })}
                />
              </div>
            </div>
          )}
          {saveError && <p className="text-sm text-red-600">{saveError}</p>}
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button
              onClick={() => { setSaveError(""); if (editItem) saveEdit.mutate(editItem); }}
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

      {/* Reply modal */}
      <Dialog open={!!replyItem} onOpenChange={(o) => !o && setReplyItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Reply to {replyItem?.name}</DialogTitle></DialogHeader>
          {replyItem && (
            <div className="space-y-4 py-2">
              <p className="text-xs text-gray-500">Sending to <span className="font-medium text-gray-700">{replyItem.email}</span></p>
              <div><label className={labelCls}>Subject</label><input className={inputCls} value={replySubject} onChange={(e) => setReplySubject(e.target.value)} /></div>
              <div><label className={labelCls}>Message</label><textarea className={inputCls} rows={6} value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} placeholder="Write your reply…" /></div>
              {sendReply.error && <p className="text-sm text-red-600">{(sendReply.error as Error).message}</p>}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button
              onClick={() => replyItem && replySubject.trim() && replyMessage.trim() && sendReply.mutate({ id: replyItem.id, subject: replySubject, message: replyMessage })}
              disabled={sendReply.isPending || !replySubject.trim() || !replyMessage.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white hover:bg-[#042045]/90 disabled:opacity-60"
            >
              {sendReply.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Send reply
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
