import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileText, MessageSquare, Users, TrendingUp, Clock, CheckCircle2, Circle, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const stats = [
  {
    label: "Total Enquiries",
    value: "24",
    change: "+12% this month",
    positive: true,
    icon: FileText,
    accent: "bg-[#042045]",
    iconBg: "bg-[#042045]/8",
    iconColor: "text-[#042045]",
  },
  {
    label: "New This Week",
    value: "7",
    change: "3 awaiting reply",
    positive: true,
    icon: TrendingUp,
    accent: "bg-emerald-500",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    label: "Subscribers",
    value: "152",
    change: "+8 this week",
    positive: true,
    icon: Users,
    accent: "bg-violet-500",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    label: "Unread Messages",
    value: "3",
    change: "Oldest: 2 days ago",
    positive: false,
    icon: MessageSquare,
    accent: "bg-amber-400",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

type Status = "New" | "In Progress" | "Responded";

const recentEnquiries = [
  { id: 1, name: "James Thornton",   email: "j.thornton@email.com",  destination: "Maldives",   travelDate: "Aug 2025", budget: "££££",  party: 2, status: "New" as Status,         received: "20 Jun 2025" },
  { id: 2, name: "Sarah Mitchell",   email: "sarah.m@gmail.com",      destination: "Dubai",      travelDate: "Sep 2025", budget: "£££",   party: 4, status: "Responded" as Status,   received: "19 Jun 2025" },
  { id: 3, name: "Oliver Chen",      email: "o.chen@outlook.com",     destination: "Japan",      travelDate: "Oct 2025", budget: "£££",   party: 2, status: "In Progress" as Status, received: "18 Jun 2025" },
  { id: 4, name: "Emma Patel",       email: "emma.p@email.com",       destination: "Bali",       travelDate: "Dec 2025", budget: "££",    party: 3, status: "New" as Status,         received: "17 Jun 2025" },
  { id: 5, name: "William Fraser",   email: "w.fraser@corp.com",      destination: "New York",   travelDate: "Jul 2025", budget: "££££",  party: 1, status: "Responded" as Status,   received: "16 Jun 2025" },
  { id: 6, name: "Amelia Johansson", email: "amelia.j@email.com",     destination: "Seychelles", travelDate: "Jan 2026", budget: "£££££", party: 2, status: "New" as Status,         received: "15 Jun 2025" },
];

const statusConfig: Record<Status, { className: string; icon: typeof Circle; dot: string }> = {
  New:           { className: "bg-blue-50 text-blue-700 ring-blue-100",   icon: Circle,       dot: "bg-blue-400" },
  "In Progress": { className: "bg-amber-50 text-amber-700 ring-amber-100", icon: Clock,       dot: "bg-amber-400" },
  Responded:     { className: "bg-emerald-50 text-emerald-700 ring-emerald-100", icon: CheckCircle2, dot: "bg-emerald-400" },
};

function StatusBadge({ status }: { status: Status }) {
  const { className, dot } = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      {status}
    </span>
  );
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const avatarColors = [
  "bg-[#042045]/10 text-[#042045]",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
];

function AdminDashboard() {
  const navigate = useNavigate();
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{dateStr}</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">{greeting} 👋</h1>
          <p className="mt-0.5 text-sm text-gray-400">Here's what's happening with Luxonair today.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, change, positive, icon: Icon, accent, iconBg, iconColor }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Top accent bar */}
            <div className={cn("absolute inset-x-0 top-0 h-[3px]", accent)} />

            <div className="mt-1 flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">{label}</p>
              <div className={cn("rounded-xl p-2.5", iconBg)}>
                <Icon className={cn("h-4 w-4", iconColor)} strokeWidth={1.75} />
              </div>
            </div>

            <p className="mt-4 text-4xl font-bold tracking-tight text-gray-900">{value}</p>

            <div className="mt-2.5 flex items-center gap-1">
              <span className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                positive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              )}>
                {positive && <ArrowUpRight className="mr-0.5 h-3 w-3" />}
                {change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent enquiries */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Card header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Recent Enquiries</h2>
            <p className="mt-0.5 text-xs text-gray-400">Latest quote requests from the website</p>
          </div>
          <button
            onClick={() => navigate({ to: "/admin/enquiries" })}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-100"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Customer", "Destination", "Travel Date", "Budget", "Party", "Status", "Received"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 first:pl-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentEnquiries.map((e, i) => (
                <tr key={e.id} className="group transition-colors hover:bg-gray-50/70">
                  <td className="py-3.5 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                        avatarColors[i % avatarColors.length]
                      )}>
                        {initials(e.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{e.name}</p>
                        <p className="text-[11px] text-gray-400">{e.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-gray-700">{e.destination}</span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{e.travelDate}</td>
                  <td className="px-4 py-3.5 font-semibold text-gray-700">{e.budget}</td>
                  <td className="px-4 py-3.5 text-gray-500">{e.party} {e.party === 1 ? "person" : "people"}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={e.status} /></td>
                  <td className="px-4 py-3.5 text-[12px] text-gray-400">{e.received}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-gray-100 md:hidden">
          {recentEnquiries.map((e, i) => (
            <div key={e.id} className="flex items-start gap-3 px-5 py-4">
              <div className={cn(
                "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                avatarColors[i % avatarColors.length]
              )}>
                {initials(e.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{e.name}</p>
                    <p className="text-[11px] text-gray-400">{e.email}</p>
                  </div>
                  <StatusBadge status={e.status} />
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
                  <span className="font-medium text-gray-700">{e.destination}</span>
                  <span>{e.travelDate}</span>
                  <span>{e.budget}</span>
                  <span>{e.party} {e.party === 1 ? "person" : "people"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
