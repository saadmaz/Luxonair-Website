import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, FileText, MessageSquare, Users, LogOut,
  Menu, X, MapPin, Tag, Sun, BookOpen, Star, HelpCircle, UserCog, Mail, Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayoutRoute,
});

const navSections = [
  {
    label: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Enquiries",
    items: [
      { to: "/admin/enquiries", label: "Enquiries", icon: FileText, exact: false, badge: "7" },
      { to: "/admin/messages", label: "Messages", icon: MessageSquare, exact: false, badge: "3", badgeGold: true },
      { to: "/admin/subscribers", label: "Subscribers", icon: Mail, exact: false },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/destinations", label: "Destinations", icon: MapPin, exact: false },
      { to: "/admin/deals", label: "Deals", icon: Tag, exact: false },
      { to: "/admin/holidays", label: "Holiday Types", icon: Sun, exact: false },
      { to: "/admin/blog", label: "Blog", icon: BookOpen, exact: false },
    ],
  },
  {
    label: "Feedback",
    items: [
      { to: "/admin/testimonials", label: "Testimonials", icon: Star, exact: false },
      { to: "/admin/faqs", label: "FAQs", icon: HelpCircle, exact: false },
    ],
  },
  {
    label: "Settings",
    items: [
      { to: "/admin/users", label: "Users", icon: UserCog, exact: false },
    ],
  },
] as const;

function AdminLayoutRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) { setAuthed(false); return; }
    const ok = typeof window !== "undefined" && localStorage.getItem("lx_admin") === "1";
    setAuthed(ok);
    if (!ok) navigate({ to: "/admin/login" });
  }, [isLoginPage, navigate]);

  if (isLoginPage) return <Outlet />;

  if (authed === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f9fb]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#042045] border-t-transparent" />
      </div>
    );
  }

  if (!authed) return null;

  const handleLogout = () => {
    localStorage.removeItem("lx_admin");
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fb]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col bg-[#042045] transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center border-b border-white/8 px-5">
          <img
            src="/Luxeonair-logo-withoutbg.png"
            alt="Luxonair"
            className="h-8 w-auto brightness-0 invert"
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="mb-1.5 px-2 text-[9px] font-bold uppercase tracking-[0.22em] text-white/25">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const { to, label, icon: Icon, exact } = item;
                  const badge = "badge" in item ? item.badge : undefined;
                  const badgeGold = "badgeGold" in item ? item.badgeGold : false;
                  const active = exact ? pathname === to : pathname.startsWith(to);
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150",
                        active
                          ? "bg-white/12 text-white"
                          : "text-white/45 hover:bg-white/6 hover:text-white/80"
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-amber-400" />
                      )}
                      <Icon className="h-[15px] w-[15px] shrink-0" strokeWidth={1.75} />
                      <span className="flex-1">{label}</span>
                      {badge && (
                        <span className={cn(
                          "flex h-4.5 min-w-[18px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white",
                          badgeGold ? "bg-amber-500" : "bg-white/15"
                        )}>
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-white/8 p-3 space-y-1">
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400/20 text-[11px] font-bold text-amber-400">
              LX
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-white truncate">Admin</p>
              <p className="text-[10px] text-white/35 truncate">Luxonair</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-white/40 transition-all hover:bg-white/6 hover:text-white/70"
          >
            <LogOut className="h-[15px] w-[15px] shrink-0" strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main column ───────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200/80 bg-white px-5 lg:px-7">
          <button
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-white" />
            </button>

            <div className="h-5 w-px bg-gray-200" />

            {/* User */}
            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-semibold text-gray-800 leading-tight">Admin</p>
                <p className="text-[11px] text-gray-400 leading-tight">Luxonair</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#042045] text-[11px] font-bold text-white ring-2 ring-[#042045]/10">
                LX
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
