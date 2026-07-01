import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, CheckCircle2, Circle, ChevronDown, Trash2, Loader2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/flight-bookings")({
  component: AdminFlightBookingsPage,
});

type Status = "New" | "In Progress" | "Responded";

type DbBooking = {
  id: number;
  offerId: string;
  routeLabel: string;
  cabinClass: string;
  price: number;
  tripType: string;
  departDate: string | null;
  returnDate: string | null;
  adults: number;
  children: number;
  infants: number;
  budget: string | null;
  notes: string | null;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
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

const statusConfig: Record<Status, { className: string; icon: typeof Circle }> = {
  New: { className: "bg-blue-50 text-blue-700 ring-blue-200", icon: Circle },
  "In Progress": { className: "bg-amber-50 text-amber-700 ring-amber-200", icon: Clock },
  Responded: { className: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: CheckCircle2 },
};

function StatusBadge({ status }: { status: Status }) {
  const { className, icon: Icon } = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1",
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

function AdminFlightBookingsPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Status | "All">("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["flight-bookings"],
    queryFn: () => api.get<DbBooking[]>("/api/flight-offer-bookings"),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: Status }) =>
      api.patch(`/api/flight-offer-bookings/${id}`, { status: uiStatusToDb(status) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["flight-bookings"] }),
  });

  const deleteBooking = useMutation({
    mutationFn: (id: number) => api.delete(`/api/flight-offer-bookings/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["flight-bookings"] });
      setDeleteId(null);
      if (expandedId === deleteId) setExpandedId(null);
    },
  });

  const uiItems = items.map((b) => ({ ...b, uiStatus: dbStatusToUI(b.status) }));
  const filtered = filter === "All" ? uiItems : uiItems.filter((b) => b.uiStatus === filter);
  const counts = {
    All: uiItems.length,
    New: uiItems.filter((b) => b.uiStatus === "New").length,
    "In Progress": uiItems.filter((b) => b.uiStatus === "In Progress").length,
    Responded: uiItems.filter((b) => b.uiStatus === "Responded").length,
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
        <h1 className="text-2xl font-bold text-gray-900">Flight Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">Enquiries submitted from flight offer cards.</p>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["All", "New", "In Progress", "Responded"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              filter === s
                ? "bg-[#042045] text-white"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50",
            )}
          >
            {s}
            <span
              className={cn(
                "ml-2 rounded-full px-1.5 py-0.5 text-xs",
                filter === s ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500",
              )}
            >
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
                {["Customer", "Route", "Trip", "Party", "Price", "Status", "Received", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 first:pl-6"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((b) => (
                <>
                  <tr key={b.id} className="transition-colors hover:bg-gray-50/40">
                    <td className="py-4 pl-6 pr-4">
                      <p className="font-semibold text-gray-900">{b.name}</p>
                      <p className="text-xs text-gray-400">{b.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-800">{b.routeLabel}</p>
                      <p className="text-xs text-gray-400">{b.cabinClass}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      <p>{b.tripType}</p>
                      <p className="text-xs text-gray-400">
                        {b.departDate ?? "Flexible"}
                        {b.returnDate ? ` → ${b.returnDate}` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {b.adults}A{b.children > 0 ? ` · ${b.children}C` : ""}
                      {b.infants > 0 ? ` · ${b.infants}I` : ""}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">
                      £{b.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={b.uiStatus}
                        onChange={(ev) =>
                          updateStatus.mutate({ id: b.id, status: ev.target.value as Status })
                        }
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 outline-none focus:border-[#042045] focus:ring-1 focus:ring-[#042045]/20 cursor-pointer"
                      >
                        <option>New</option>
                        <option>In Progress</option>
                        <option>Responded</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-400">
                      {new Date(b.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setDeleteId(b.id)}
                          className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                          className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50"
                        >
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 transition-transform",
                              expandedId === b.id && "rotate-180",
                            )}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === b.id && (
                    <tr key={`${b.id}-exp`} className="bg-blue-50/30">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Phone
                            </p>
                            <p className="mt-1 text-gray-800">{b.phone}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Approx. budget
                            </p>
                            <p className="mt-1 text-gray-800">{b.budget || "-"}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Notes
                            </p>
                            <p className="mt-1 text-gray-800">{b.notes || "-"}</p>
                          </div>
                          <div className="col-span-2 flex items-center gap-2">
                            <a
                              href={`mailto:${b.email}`}
                              className="rounded-lg bg-[#042045] px-4 py-2 text-xs font-semibold text-white hover:bg-[#042045]/90"
                            >
                              Reply by email
                            </a>
                            <a
                              href={`https://wa.me/${b.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
                              WhatsApp
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-400">
                    No bookings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y divide-gray-100 md:hidden">
          {filtered.map((b) => (
            <div key={b.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{b.name}</p>
                  <p className="text-xs text-gray-400">{b.email}</p>
                </div>
                <StatusBadge status={b.uiStatus} />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                <span className="font-medium text-gray-700">{b.routeLabel}</span>
                <span>{b.cabinClass}</span>
                <span>{b.tripType}</span>
                <span>£{b.price.toLocaleString()}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <a
                  href={`mailto:${b.email}`}
                  className="rounded-lg bg-[#042045] px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Reply
                </a>
                <button
                  onClick={() => setDeleteId(b.id)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-gray-400">No bookings yet.</p>
          )}
        </div>
      </div>

      {/* Delete modal */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete booking?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            This will remove the booking from the dashboard. This action cannot be undone.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={() => deleteId !== null && deleteBooking.mutate(deleteId)}
              disabled={deleteBooking.isPending}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleteBooking.isPending ? "Deleting…" : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
