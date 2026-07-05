import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PlusCircle, Pencil, Trash2, Activity, ShieldCheck, type LucideIcon } from "lucide-react";
import { api } from "@/lib/api";
import { Pagination } from "@/components/ui/Pagination";

export const Route = createFileRoute("/admin/logs")({
  component: AdminLogsPage,
});

type LogRow = {
  id: number;
  adminEmail: string;
  adminName: string;
  method: string;
  path: string;
  status: number;
  action: string;
  resourceType: string | null;
  resourceLabel: string | null;
  message: string;
  createdAt: string;
};

const ACTION_STYLE: Record<string, { Icon: LucideIcon; cls: string }> = {
  created: { Icon: PlusCircle, cls: "bg-emerald-50 text-emerald-600" },
  updated: { Icon: Pencil, cls: "bg-blue-50 text-blue-600" },
  deleted: { Icon: Trash2, cls: "bg-red-50 text-red-600" },
  other: { Icon: Activity, cls: "bg-gray-100 text-gray-500" },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AdminLogsPage() {
  const [page, setPage] = useState(1);
  const { data: result, isLoading, error } = useQuery({
    queryKey: ["admin-actions", page],
    queryFn: () => api.getPaged<LogRow>("/api/admin-actions", page),
  });
  const items = result?.data ?? [];
  const total = result?.total ?? 0;

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
          {(error as Error).message === "Forbidden — superadmin required"
            ? "Your account doesn't have permission to view logs — only superadmin accounts can access this page."
            : `Couldn't load logs: ${(error as Error).message}`}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logs</h1>
          <p className="mt-1 text-sm text-gray-500">
            {total} recorded actions — every admin change, permanently kept.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500">
          <ShieldCheck className="h-3.5 w-3.5 text-gray-400" />
          Immutable — cannot be edited or deleted
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Time", "Action", "Status", "Endpoint"].map((h) => (
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
              {items.map((row) => {
                const { Icon, cls } = ACTION_STYLE[row.action] ?? ACTION_STYLE.other;
                return (
                  <tr key={row.id} className="transition-colors hover:bg-gray-50/60">
                    <td className="whitespace-nowrap py-3.5 pl-6 pr-4 text-gray-400">
                      {formatTime(row.createdAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${cls}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-gray-700">{row.message}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          row.status < 400 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="max-w-[240px] truncate px-4 py-3.5 text-xs text-gray-400">
                      <span className="font-mono">{row.method}</span> {row.path}
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400">
                    No actions recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-gray-100 md:hidden">
          {items.map((row) => {
            const { Icon, cls } = ACTION_STYLE[row.action] ?? ACTION_STYLE.other;
            return (
              <div key={row.id} className="flex items-start gap-3 px-5 py-3.5">
                <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${cls}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-800">{row.message}</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {formatTime(row.createdAt)} · {row.status}
                  </p>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <p className="px-5 py-12 text-center text-sm text-gray-400">No actions recorded yet</p>
          )}
        </div>
        <Pagination page={page} total={total} limit={50} onChange={setPage} />
      </div>
    </div>
  );
}
