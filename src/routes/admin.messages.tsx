import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, MailOpen, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessagesPage,
});

type Message = {
  id: number; name: string; email: string; subject: string;
  body: string; received: string; read: boolean;
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
    subject: row.topic ?? "Contact form message",
    body: row.message,
    received: new Date(row.createdAt).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    }),
    read: row.read,
  };
}

function AdminMessagesPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

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

  const selectedMsg = items.find((m) => m.id === selected);
  const unread = items.filter((m) => !m.read).length;

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
        <p className="mt-1 text-sm text-gray-500">
          Contact form submissions.{" "}
          {unread > 0 && <span className="font-semibold text-amber-600">{unread} unread</span>}
          {unread === 0 && <span className="text-emerald-600">All read</span>}
        </p>
      </div>

      <div className="flex h-[calc(100vh-220px)] min-h-[400px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* List */}
        <div className={cn("flex w-full flex-col divide-y divide-gray-100 overflow-y-auto md:w-80 md:border-r md:border-gray-100", selected !== null && "hidden md:flex")}>
          {items.length === 0 && (
            <div className="flex flex-1 items-center justify-center p-8 text-center">
              <p className="text-sm text-gray-400">No messages yet</p>
            </div>
          )}
          {items.map((m) => (
            <button key={m.id} onClick={() => open(m.id)}
              className={cn("flex flex-col items-start gap-1 px-4 py-4 text-left transition-colors hover:bg-gray-50", selected === m.id && "bg-blue-50/60", !m.read && "bg-amber-50/30")}
            >
              <div className="flex w-full items-center gap-2">
                {m.read ? <MailOpen className="h-3.5 w-3.5 shrink-0 text-gray-300" /> : <Mail className="h-3.5 w-3.5 shrink-0 text-amber-500" />}
                <p className={cn("flex-1 truncate text-sm", !m.read ? "font-semibold text-gray-900" : "font-medium text-gray-700")}>{m.name}</p>
                <p className="text-[11px] text-gray-400">{m.received.split(" ").slice(0, 2).join(" ")}</p>
              </div>
              <p className="pl-5 text-xs font-medium text-gray-600 truncate w-full">{m.subject}</p>
              <p className="pl-5 line-clamp-1 text-xs text-gray-400">{m.body}</p>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className={cn("flex flex-1 flex-col", selected === null && "hidden md:flex md:items-center md:justify-center")}>
          {selectedMsg ? (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div>
                  <p className="font-semibold text-gray-900">{selectedMsg.name}</p>
                  <p className="text-xs text-gray-400">{selectedMsg.email} · {selectedMsg.received}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelected(null)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 md:hidden">Back</button>
                  <button onClick={() => setDeleteId(selectedMsg.id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                  <a href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`} className="rounded-lg bg-[#042045] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#042045]/90">Reply</a>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <h2 className="mb-4 text-base font-semibold text-gray-900">{selectedMsg.subject}</h2>
                <p className="text-sm leading-relaxed text-gray-700">{selectedMsg.body}</p>
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
