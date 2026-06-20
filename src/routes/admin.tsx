import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  LogOut,
  Plane,
  Menu,
  X,
  MapPin,
  Tag,
  Sun,
  BookOpen,
  Star,
  HelpCircle,
  UserCog,
  Mail,
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
      { to: "/admin/enquiries", label: "Enquiries", icon: FileText, exact: false, badge: "7", badgeColor: "bg-white/15" },
      { to: "/admin/messages", label: "Messages", icon: MessageSquare, exact: false, badge: "3", badgeColor: "bg-amber-500/80" },
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
    if (isLoginPage) {
      setAuthed(false);
      return;
    }
    const ok = typeof window !== "undefined" && localStorage.getItem("lx_admin") === "1";
    setAuthed(ok);
    if (!ok) navigate({ to: "/admin/login" });
  }, [isLoginPage, navigate]);

  if (isLoginPage) return <Outlet />;

  if (authed === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#042045] border-t-transparent" />
      </div>
    );
  }

  if (!authed) return null;

  const handleLogout = () => {
    localStorage.removeItem("lx_admin");
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-[#042045] transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <Plane className="h-4 w-4 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">Luxonair</p>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Admin</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-5">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const { to, label, icon: Icon, exact } = item;
                  const badge = "badge" in item ? item.badge : undefined;
                  const badgeColor = "badgeColor" in item ? item.badgeColor : undefined;
                  const active = exact ? pathname === to : pathname.startsWith(to);
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                        active
                          ? "bg-white/15 text-white shadow-sm"
                          : "text-white/55 hover:bg-white/8 hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                      {label}
                      {badge && (
                        <span className={cn("ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold text-white", badgeColor)}>
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

        {/* Footer */}
        <div className="shrink-0 border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/55 transition-all duration-150 hover:bg-white/8 hover:text-white"
          >
            <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
          <button
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">Admin</p>
              <p className="text-xs text-gray-400">Luxonair</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#042045] text-xs font-bold text-white">
              LX
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
