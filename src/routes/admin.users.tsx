import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, ShieldCheck, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

type Role = "Super Admin" | "Admin" | "Editor";
type User = { id: number; name: string; email: string; role: Role; lastLogin: string; status: "Active" | "Inactive" };

const initialUsers: User[] = [
  { id: 1, name: "Admin", email: "info@luxeonair.co.uk", role: "Super Admin", lastLogin: "20 Jun 2025, 13:45", status: "Active" },
  { id: 2, name: "Saad Mazhar", email: "info@luxeonair.co.uk", role: "Admin", lastLogin: "19 Jun 2025, 09:12", status: "Active" },
];

const inputCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#042045] focus:bg-white focus:ring-2 focus:ring-[#042045]/10";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";
const emptyForm = { name: "", email: "", role: "Admin" as Role };

function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [modal, setModal] = useState<"invite" | "edit" | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);

  const openInvite = () => { setForm(emptyForm); setModal("invite"); };
  const openEdit = (u: User) => { setEditId(u.id); setForm({ name: u.name, email: u.email, role: u.role }); setModal("edit"); };

  const handleSave = () => {
    if (modal === "invite") {
      setUsers((prev) => [...prev, { id: Date.now(), ...form, lastLogin: "Never", status: "Active" }]);
    } else if (editId !== null) {
      setUsers((prev) => prev.map((u) => u.id === editId ? { ...u, ...form } : u));
    }
    setModal(null);
  };

  const confirmDelete = () => {
    if (deleteId == null) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">Admin accounts with dashboard access.</p>
        </div>
        <button onClick={openInvite} className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90">
          <Plus className="h-4 w-4" />Invite user
        </button>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Password-protected dashboard</p>
          <p className="mt-0.5 text-xs text-blue-600">
            The admin password is set as an environment variable (<code className="rounded bg-blue-100 px-1 py-0.5 font-mono">ADMIN_PASSWORD</code>). Real per-user authentication will be added in a future phase.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["User", "Email", "Role", "Last login", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 first:pl-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-gray-50/60">
                  <td className="py-4 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#042045] text-xs font-bold text-white">{u.name.charAt(0)}</div>
                      <p className="font-semibold text-gray-900">{u.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{u.email}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${u.role === "Super Admin" ? "bg-[#042045]/8 text-[#042045]" : "bg-gray-100 text-gray-600"}`}>
                      <Shield className="h-3 w-3" />{u.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-400">{u.lastLogin}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${u.status === "Active" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-gray-50 text-gray-500 ring-gray-200"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${u.status === "Active" ? "bg-emerald-500" : "bg-gray-400"}`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(u)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"><Pencil className="h-3.5 w-3.5" /></button>
                      <button
                        onClick={() => u.role !== "Super Admin" && setDeleteId(u.id)}
                        disabled={u.role === "Super Admin"}
                        className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
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
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-3 px-5 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#042045] text-sm font-bold text-white">{u.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{u.name}</p>
                <p className="text-xs text-gray-400">{u.email} · {u.role}</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => openEdit(u)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => u.role !== "Super Admin" && setDeleteId(u.id)} disabled={u.role === "Super Admin"} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite / Edit modal */}
      <Dialog open={modal !== null} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{modal === "invite" ? "Invite user" : "Edit user"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><label className={labelCls}>Name</label><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className={labelCls}>Email</label><input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div>
              <label className={labelCls}>Role</label>
              <select className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
                <option>Admin</option><option>Editor</option><option>Super Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button onClick={handleSave} className="rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white hover:bg-[#042045]/90">{modal === "invite" ? "Invite" : "Save"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete modal */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Remove user?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">This user will lose access to the admin dashboard.</p>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Remove</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
