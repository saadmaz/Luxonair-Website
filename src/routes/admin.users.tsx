import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, ShieldCheck, Shield } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

const users = [
  { id: 1, name: "Admin", email: "admin@luxonair.com", role: "Super Admin", lastLogin: "20 Jun 2025, 13:45", status: "Active" },
  { id: 2, name: "Saad Mazhar", email: "hello@luxonair.com", role: "Admin", lastLogin: "19 Jun 2025, 09:12", status: "Active" },
];

function AdminUsersPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">Admin accounts with dashboard access.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90">
          <Plus className="h-4 w-4" />
          Invite user
        </button>
      </div>

      {/* Info banner */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Password-protected dashboard</p>
          <p className="mt-0.5 text-xs text-blue-600">The admin password is set as an environment variable (<code className="rounded bg-blue-100 px-1 py-0.5 font-mono">ADMIN_PASSWORD</code>). Real user authentication will be added in a future phase.</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Desktop */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["User", "Email", "Role", "Last login", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 first:pl-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-gray-50/60">
                  <td className="py-4 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#042045] text-xs font-bold text-white">
                        {u.name.charAt(0)}
                      </div>
                      <p className="font-semibold text-gray-900">{u.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{u.email}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${u.role === "Super Admin" ? "bg-[#042045]/8 text-[#042045]" : "bg-gray-100 text-gray-600"}`}>
                      <Shield className="h-3 w-3" />
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-400">{u.lastLogin}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500" disabled={u.id === 1}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y divide-gray-100 md:hidden">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-3 px-5 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#042045] text-sm font-bold text-white">
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{u.name}</p>
                <p className="text-xs text-gray-400">{u.email}</p>
                <p className="text-xs text-gray-400">{u.role} · {u.lastLogin}</p>
              </div>
              <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
