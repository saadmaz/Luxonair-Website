import { createFileRoute } from "@tanstack/react-router";
import { FileText, MessageSquare, Users, TrendingUp, Clock, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

// ─── Mock data ────────────────────────────────────────────────────────────────

const stats = [
  {
    label: "Total Enquiries",
    value: "24",
    change: "+12% this month",
    positive: true,
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "New This Week",
    value: "7",
    change: "3 awaiting reply",
    positive: true,
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Subscribers",
    value: "152",
    change: "+8 this week",
    positive: true,
    icon: Users,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    label: "Unread Messages",
    value: "3",
    change: "Oldest: 2 days ago",
    positive: false,
    icon: MessageSquare,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

type Status = "New" | "In Progress" | "Responded";

const recentEnquiries: {
  id: number;
  name: string;
  email: string;
  destination: string;
  travelDate: string;
  budget: string;
  party: number;
  status: Status;
  received: string;
}[] = [
  {
    id: 1,
    name: "James Thornton",
    email: "j.thornton@email.com",
    destination: "Maldives",
    travelDate: "Aug 2025",
    budget: "££££",
    party: 2,
    status: "New",
    received: "20 Jun 2025",
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    email: "sarah.m@gmail.com",
    destination: "Dubai",
    travelDate: "Sep 2025",
    budget: "£££",
    party: 4,
    status: "Responded",
    received: "19 Jun 2025",
  },
  {
    id: 3,
    name: "Oliver Chen",
    email: "o.chen@outlook.com",
    destination: "Japan",
    travelDate: "Oct 2025",
    budget: "£££",
    party: 2,
    status: "In Progress",
    received: "18 Jun 2025",
  },
  {
    id: 4,
    name: "Emma Patel",
    email: "emma.p@email.com",
    destination: "Bali",
    travelDate: "Dec 2025",
    budget: "££",
    party: 3,
    status: "New",
    received: "17 Jun 2025",
  },
  {
    id: 5,
    name: "William Fraser",
    email: "w.fraser@corp.com",
    destination: "New York",
    travelDate: "Jul 2025",
    budget: "££££",
    party: 1,
    status: "Responded",
    received: "16 Jun 2025",
  },
  {
    id: 6,
    name: "Amelia Johansson",
    email: "amelia.j@email.com",
    destination: "Seychelles",
    travelDate: "Jan 2026",
    budget: "£££££",
    party: 2,
    status: "New",
    received: "15 Jun 2025",
  },
];

// ─── Status badge ─────────────────────────────────────────────────────────────

const statusConfig: Record<Status, { label: string; className: string; icon: typeof Circle }> = {
  New: {
    label: "New",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
    icon: Circle,
  },
  "In Progress": {
    label: "In Progress",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Clock,
  },
  Responded: {
    label: "Responded",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2,
  },
};

function StatusBadge({ status }: { status: Status }) {
  const { label, className, icon: Icon } = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1",
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function AdminDashboard() {
  return (
    <div className="p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back — here's what's happening with Luxonair.
        </p>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, change, positive, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <div className={cn("rounded-lg p-2", bg)}>
                <Icon className={cn("h-4 w-4", color)} strokeWidth={1.75} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
            <p className={cn("mt-1 text-xs", positive ? "text-emerald-600" : "text-amber-600")}>
              {change}
            </p>
          </div>
        ))}
      </div>

      {/* Recent enquiries */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Recent Enquiries</h2>
            <p className="text-xs text-gray-400">Latest quote requests from the website</p>
          </div>
          <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50">
            View all
          </button>
        </div>

        {/* Table — desktop */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Destination
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Travel Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Budget
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Party
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Received
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentEnquiries.map((e) => (
                <tr
                  key={e.id}
                  className="transition-colors hover:bg-gray-50/60"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{e.name}</p>
                    <p className="text-xs text-gray-400">{e.email}</p>
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-700">{e.destination}</td>
                  <td className="px-4 py-4 text-gray-500">{e.travelDate}</td>
                  <td className="px-4 py-4 font-medium text-gray-700">{e.budget}</td>
                  <td className="px-4 py-4 text-gray-500">
                    {e.party} {e.party === 1 ? "person" : "people"}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="px-4 py-4 text-gray-400">{e.received}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card list — mobile */}
        <div className="divide-y divide-gray-100 md:hidden">
          {recentEnquiries.map((e) => (
            <div key={e.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{e.name}</p>
                  <p className="text-xs text-gray-400">{e.email}</p>
                </div>
                <StatusBadge status={e.status} />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span>
                  <span className="font-medium text-gray-700">{e.destination}</span>
                </span>
                <span>{e.travelDate}</span>
                <span>{e.budget}</span>
                <span>
                  {e.party} {e.party === 1 ? "person" : "people"}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-gray-400">{e.received}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
