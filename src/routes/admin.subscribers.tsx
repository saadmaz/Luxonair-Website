import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, Trash2, Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { Pagination } from "@/components/ui/Pagination";

export const Route = createFileRoute("/admin/subscribers")({
  component: AdminSubscribersPage,
});

type Subscriber = { id: number; email: string; joined: string };

type DbSubscriber = { id: number; email: string; createdAt: string };

function toUISubscriber(row: DbSubscriber): Subscriber {
  return {
    id: row.id,
    email: row.email,
    joined: new Date(row.createdAt).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    }),
  };
}

const inputCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#042045] focus:bg-white focus:ring-2 focus:ring-[#042045]/10";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

function AdminSubscribersPage() {
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [addError, setAddError] = useState("");

  const [page, setPage] = useState(1);
  const { data: result, isLoading } = useQuery({
    queryKey: ["subscribers", page],
    queryFn: () => api.getPaged<DbSubscriber>("/api/subscribers", page),
  });
  const items = (result?.data ?? []).map(toUISubscriber);
  const total = result?.total ?? 0;

  const addSubscriber = useMutation({
    mutationFn: (email: string) => api.post("/api/subscribers", { email }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subscribers"] });
      setNewEmail("");
      setAddOpen(false);
      setAddError("");
    },
    onError: (e: Error) => setAddError(e.message),
  });

  const deleteSubscriber = useMutation({
    mutationFn: (id: number) => api.delete(`/api/subscribers/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["subscribers"] }); setDeleteId(null); },
  });

  const handleAdd = () => {
    if (!newEmail.trim() || !/.+@.+\..+/.test(newEmail)) {
      setAddError("Enter a valid email address.");
      return;
    }
    addSubscriber.mutate(newEmail.trim());
  };

  const handleExport = () => {
    const csv = ["Email,Joined", ...items.map((s) => `${s.email},${s.joined}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
          <p className="mt-1 text-sm text-gray-500">{total} newsletter subscribers.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Download className="h-4 w-4" />Export CSV
          </button>
          <button onClick={() => { setAddOpen(true); setAddError(""); setNewEmail(""); }} className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90">
            <Plus className="h-4 w-4" />Add subscriber
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Email", "Joined", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 first:pl-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-gray-50/60">
                  <td className="py-3.5 pl-6 pr-4 text-gray-700">{s.email}</td>
                  <td className="px-4 py-3.5 text-gray-400">{s.joined}</td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => setDeleteId(s.id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-400">No subscribers yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-gray-100 md:hidden">
          {items.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm font-medium text-gray-900">{s.email}</p>
                <p className="text-xs text-gray-400">{s.joined}</p>
              </div>
              <button onClick={() => setDeleteId(s.id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
        <Pagination page={page} total={total} limit={50} onChange={setPage} />
      </div>

      {/* Add modal */}
      <Dialog open={addOpen} onOpenChange={(o) => { if (!o) { setAddOpen(false); setNewEmail(""); setAddError(""); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add subscriber</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className={labelCls}>Email address *</label>
              <input
                type="email"
                className={inputCls}
                placeholder="email@example.com"
                value={newEmail}
                onChange={(e) => { setNewEmail(e.target.value); setAddError(""); }}
              />
              {addError && <p className="mt-1 text-xs text-red-600">{addError}</p>}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button
              onClick={handleAdd}
              disabled={addSubscriber.isPending}
              className="rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white hover:bg-[#042045]/90 disabled:opacity-60"
            >
              {addSubscriber.isPending ? "Adding…" : "Add"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete modal */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Remove subscriber?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">They will no longer receive newsletter emails.</p>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button
              onClick={() => deleteId !== null && deleteSubscriber.mutate(deleteId)}
              disabled={deleteSubscriber.isPending}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleteSubscriber.isPending ? "Removing…" : "Remove"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
