import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ShieldCheck, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

type DbUser = { id: number; email: string; createdAt: string };

const inputCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#042045] focus:bg-white focus:ring-2 focus:ring-[#042045]/10";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

function AdminUsersPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<"invite" | "edit" | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [editForm, setEditForm] = useState({ email: "", password: "" });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get<DbUser[]>("/api/users"),
  });

  const createMut = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post<DbUser[]>("/api/users", data),
    onSuccess: (rows) => {
      qc.setQueryData(["users"], rows);
      setModal(null);
      setForm({ email: "", password: "" });
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { email?: string; password?: string } }) =>
      api.patch<DbUser[]>(`/api/users/${id}`, data),
    onSuccess: (rows) => {
      qc.setQueryData(["users"], rows);
      setModal(null);
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete<DbUser[]>(`/api/users/${id}`),
    onSuccess: (rows) => {
      qc.setQueryData(["users"], rows);
      setDeleteId(null);
    },
  });

  const openEdit = (u: DbUser) => {
    setEditId(u.id);
    setEditForm({ email: u.email, password: "" });
    setModal("edit");
  };

  const handleCreate = () => {
    if (!form.email || !form.password) return;
    createMut.mutate(form);
  };

  const handleUpdate = () => {
    if (!editId) return;
    const payload: { email?: string; password?: string } = {};
    if (editForm.email) payload.email = editForm.email;
    if (editForm.password) payload.password = editForm.password;
    updateMut.mutate({ id: editId, data: payload });
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">Admin accounts with dashboard access.</p>
        </div>
        <button
          onClick={() => { setForm({ email: "", password: "" }); setModal("invite"); }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90"
        >
          <Plus className="h-4 w-4" />Add user
        </button>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Password-protected dashboard</p>
          <p className="mt-0.5 text-xs text-blue-600">
            Users added here are stored in the database with bcrypt-hashed passwords. The primary admin account is also controlled via <code className="rounded bg-blue-100 px-1 py-0.5 font-mono">ADMIN_EMAIL</code> and <code className="rounded bg-blue-100 px-1 py-0.5 font-mono">ADMIN_PASSWORD_HASH</code> environment variables.
          </p>
        </div>
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
                  {["Email", "Created", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 first:pl-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-400">No additional users yet</td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-gray-50/60">
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#042045] text-xs font-bold text-white">
                          {u.email.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-medium text-gray-900">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(u)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setDeleteId(u.id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">
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
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#042045] text-sm font-bold text-white">
                  {u.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-gray-900">{u.email}</p>
                  <p className="text-xs text-gray-400">
                    Added {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(u)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => setDeleteId(u.id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add user modal */}
      <Dialog open={modal === "invite"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add user</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Password</label>
              <input type="password" className={inputCls} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimum 8 characters" />
            </div>
            {createMut.error && <p className="text-sm text-red-600">{(createMut.error as Error).message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
            </DialogClose>
            <button
              onClick={handleCreate}
              disabled={createMut.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white hover:bg-[#042045]/90 disabled:opacity-60"
            >
              {createMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Add user
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit user modal */}
      <Dialog open={modal === "edit"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Edit user</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" className={inputCls} value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>New password <span className="font-normal text-gray-400">(leave blank to keep current)</span></label>
              <input type="password" className={inputCls} value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} placeholder="Minimum 8 characters" />
            </div>
            {updateMut.error && <p className="text-sm text-red-600">{(updateMut.error as Error).message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
            </DialogClose>
            <button
              onClick={handleUpdate}
              disabled={updateMut.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white hover:bg-[#042045]/90 disabled:opacity-60"
            >
              {updateMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete modal */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Remove user?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">This user will lose access to the admin dashboard immediately.</p>
          <DialogFooter>
            <DialogClose asChild>
              <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
            </DialogClose>
            <button
              onClick={() => deleteId !== null && deleteMut.mutate(deleteId)}
              disabled={deleteMut.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleteMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Remove
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
