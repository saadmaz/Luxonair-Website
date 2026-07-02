import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, MailOpen, Trash2, Loader2, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { NotesLog } from "@/components/admin/NotesLog";
import type { NoteEntry, NoteType } from "@/lib/notes";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessagesPage,
});

type Message = {
  id: number; name: string; email: string; phone: string | null;
  topic: string; message: string; received: string; read: boolean;
};

type DbContact = {
  id: number; name: string; email: string;
  phone: string | null; topic: string | null; message: string;
  read: boolean; createdAt: string;
};

function toUIMessage(row: DbContact): Message {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    topic: row.topic || "General enquiry",
    message: row.message,
    received: new Date(row.createdAt).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    }),
    read: row.read,
  };
}

type StatusFilter = "All" | "Unread" | "Read";

function AdminMessagesPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [topicFilter, setTopicFilter] = useState<string>("All");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => api.get<DbContact[]>("/api/contacts").then((rows) => rows.map(toUIMessage)),
  });

  const markRead = useMutation({
    mutationFn: (id: number) => api.patch(`/api/contacts/${id}`, { read: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });

  const deleteMsg = useMutation({
    mutationFn: (id: number) => api.delete(`/api/contacts/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
      setDeleteId(null);
      if (selected === deleteId) setSelected(null);
    },
  });

  const { data: notes = [] } = useQuery({
    queryKey: ["contact-notes", selected],
    queryFn: () => api.get<NoteEntry[]>(`/api/contacts/${selected}/notes`),
    enabled: selected !== null,
  });

  const addNote = useMutation({
    mutationFn: (vars: { id: number; body: string; type: NoteType }) =>
      api.post<NoteEntry>(`/api/contacts/${vars.id}/notes`, { body: vars.body, type: vars.type }),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["contact-notes", vars.id] }),
  });

  const topics = useMemo(() => Array.from(new Set(items.map((m) => m.topic))).sort(), [items]);

  const filtered = items.filter((m) => {
    if (statusFilter === "Unread" && m.read) return false;
    if (statusFilter === "Read" && !m.read) return false;
    if (topicFilter !== "All" && m.topic !== topicFilter) return false;
    return true;
  });

  const counts = {
    All: items.length,
    Unread: items.filter((m) => !m.read).length,
    Read: items.filter((m) => m.read).length,
  };

  const selectedMsg = items.find((m) => m.id === selected);

  const open = (id: number) => {
    setSelected(id);
    const msg = items.find((m) => m.id === id);
    if (msg && !msg.read) markRead.mutate(id);
  };

  const confirmDelete = () => {
    if (deleteId != null) deleteMsg.mutate(deleteId);
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
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-500">Contact form submissions.</p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["All", "Unread", "Read"] as const).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              statusFilter === s ? "bg-[#042045] text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50")}
          >
            {s}
            <span className={cn("ml-2 rounded-full px-1.5 py-0.5 text-xs", statusFilter === s ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500")}>
              {counts[s]}
            </span>
          </button>
        ))}
        {topics.length > 0 && (
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="ml-auto rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-[#042045] focus:ring-1 focus:ring-[#042045]/20"
          >
            <option value="All">All topics</option>
            {topics.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        )}
      </div>

      <div className="flex h-[calc(100vh-260px)] min-h-[400px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* List */}
        <div className={cn("flex w-full flex-col divide-y divide-gray-100 overflow-y-auto md:w-80 md:border-r md:border-gray-100", selected !== null && "hidden md:flex")}>
          {filtered.length === 0 && (
            <div className="flex flex-1 items-center justify-center p-8 text-center">
              <p className="text-sm text-gray-400">No messages match this filter</p>
            </div>
          )}
          {filtered.map((m) => (
            <button key={m.id} onClick={() => open(m.id)}
              className={cn("flex flex-col items-start gap-1 px-4 py-4 text-left transition-colors hover:bg-gray-50", selected === m.id && "bg-blue-50/60", !m.read && "bg-amber-50/30")}
            >
              <div className="flex w-full items-center gap-2">
                {m.read ? <MailOpen className="h-3.5 w-3.5 shrink-0 text-gray-300" /> : <Mail className="h-3.5 w-3.5 shrink-0 text-amber-500" />}
                <p className={cn("flex-1 truncate text-sm", !m.read ? "font-semibold text-gray-900" : "font-medium text-gray-700")}>{m.name}</p>
                <p className="text-[11px] text-gray-400">{m.received.split(" ").slice(0, 2).join(" ")}</p>
              </div>
              <p className="pl-5 text-xs font-medium text-gray-600 truncate w-full">{m.topic}</p>
              <p className="pl-5 line-clamp-1 text-xs text-gray-400">{m.message}</p>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className={cn("flex flex-1 flex-col overflow-y-auto", selected === null && "hidden md:flex md:items-center md:justify-center")}>
          {selectedMsg ? (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div>
                  <p className="font-semibold text-gray-900">{selectedMsg.name}</p>
                  <p className="text-xs text-gray-400">
                    {selectedMsg.email}
                    {selectedMsg.phone && <> · <Phone className="inline h-3 w-3 -mt-0.5" /> {selectedMsg.phone}</>}
                    {" · "}{selectedMsg.received}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelected(null)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 md:hidden">Back</button>
                  <button onClick={() => setDeleteId(selectedMsg.id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                  <a href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.topic}`} className="rounded-lg bg-[#042045] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#042045]/90">Reply</a>
                </div>
              </div>
              <div className="px-6 py-5">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200">{selectedMsg.topic}</span>
                <p className="mt-4 text-sm leading-relaxed text-gray-700">{selectedMsg.message}</p>
              </div>
              <div className="mt-auto border-t border-gray-100 px-6 py-5">
                <label className="mb-1 block text-sm font-medium text-gray-700">Activity log</label>
                <NotesLog
                  notes={notes}
                  isPending={addNote.isPending}
                  onAdd={(body, type) => selectedMsg && addNote.mutate({ id: selectedMsg.id, body, type })}
                />
              </div>
            </>
          ) : (
            <div className="text-center">
              <MailOpen className="mx-auto h-10 w-10 text-gray-200" />
              <p className="mt-3 text-sm font-medium text-gray-400">Select a message to read</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete message?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">This will permanently remove the message. This cannot be undone.</p>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button
              onClick={confirmDelete}
              disabled={deleteMsg.isPending}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleteMsg.isPending ? "Deleting…" : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
