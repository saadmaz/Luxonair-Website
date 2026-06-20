import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, FileText, MessageSquare, LogOut,
  Menu, X, MapPin, Tag, Sun, BookOpen, Star, HelpCircle,
  UserCog, Mail, Bell, Search, ChevronRight, PanelLeftClose, PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayoutRoute,
});

const navSections = [
  {
    label: "Overview",
    items: [
      { to: "/admin",              label: "Dashboard",    icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Enquiries",
    items: [
      { to: "/admin/enquiries",    label: "Enquiries",    icon: FileText,       exact: false, badge: "7" },
      { to: "/admin/messages",     label: "Messages",     icon: MessageSquare,  exact: false, badge: "3", badgeGold: true },
      { to: "/admin/subscribers",  label: "Subscribers",  icon: Mail,           exact: false },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/destinations", label: "Destinations",  icon: MapPin,   exact: false },
      { to: "/admin/deals",        label: "Deals",         icon: Tag,      exact: false },
      { to: "/admin/holidays",     label: "Holiday Types", icon: Sun,      exact: false },
      { to: "/admin/blog",         label: "Blog",          icon: BookOpen, exact: false },
    ],
  },
  {
    label: "Feedback",
    items: [
      { to: "/admin/testimonials", label: "Testimonials", icon: Star,       exact: false },
      { to: "/admin/faqs",         label: "FAQs",         icon: HelpCircle, exact: false },
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

  // Mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  // Desktop collapse — persisted in localStorage
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("lx_sidebar_collapsed") === "1";
  });

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem("lx_sidebar_collapsed", next ? "1" : "0");
      return next;
    });
  };

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
      <div className="flex h-screen items-center justify-center bg-[#f1f4f8]">
        <div className="h-5 w-5 animate-spin rounded-full border-[2.5px] border-[#042045] border-t-transparent" />
      </div>
    );
  }

  if (!authed) return null;

  const handleLogout = () => {
    localStorage.removeItem("lx_admin");
    navigate({ to: "/admin/login" });
  };

  const activeItem = navSections
    .flatMap((s) => s.items)
    .find((item) => (item.exact ? pathname === item.to : pathname.startsWith(item.to)));

  return (
    <div className="flex h-screen overflow-hidden bg-[#f1f4f8]">

      {/* ── Mobile backdrop ─────────────────────────────────────── */}
      <div
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#031e3e] transition-all duration-300 ease-in-out",
          "lg:static lg:translate-x-0",
          // desktop width: collapsed = icon rail, expanded = full
          collapsed ? "lg:w-[60px]" : "lg:w-60",
          // mobile: always full width drawer, shown/hidden by translate
          "w-60",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:shadow-none"
        )}
      >
        {/* Brand row */}
        <div className={cn(
          "flex h-[60px] shrink-0 items-center border-b border-white/[0.07]",
          collapsed ? "lg:justify-center lg:px-0 px-4" : "justify-between px-4"
        )}>
          {/* Logo — hidden in collapsed desktop mode */}
          <img
            src="/Luxeonair-logo-withoutbg.png"
            alt="Luxonair"
            className={cn(
              "h-7 w-auto brightness-0 invert opacity-90 transition-all duration-300",
              collapsed && "lg:hidden"
            )}
          />
          {/* Collapsed: show monogram */}
          {collapsed && (
            <div className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <span className="text-[11px] font-bold text-white">LX</span>
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={toggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-white/25 transition-colors hover:bg-white/8 hover:text-white/70",
              collapsed && "lg:hidden"
            )}
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-white/25 transition-colors hover:bg-white/8 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden py-4",
            collapsed ? "lg:px-1.5 px-2.5" : "px-2.5"
          )}
          style={{ scrollbarWidth: "none" }}
        >
          {navSections.map((section, si) => (
            <div key={section.label} className={si > 0 ? "mt-5" : ""}>
              {/* Section label — hidden when collapsed on desktop */}
              {(!collapsed) && (
                <p className="mb-1 px-2.5 text-[9.5px] font-bold uppercase tracking-[0.2em] text-white/25">
                  {section.label}
                </p>
              )}
              {/* Collapsed: thin divider instead of label */}
              {collapsed && si > 0 && (
                <div className="hidden lg:block mb-1 mx-1.5 border-t border-white/[0.08]" />
              )}
              <ul className="space-y-px">
                {section.items.map((item) => {
                  const { to, label, icon: Icon, exact } = item;
                  const badge     = "badge"     in item ? item.badge     : undefined;
                  const badgeGold = "badgeGold" in item ? item.badgeGold : false;
                  const active    = exact ? pathname === to : pathname.startsWith(to);
                  return (
                    <li key={to}>
                      <Link
                        to={to}
                        onClick={() => setMobileOpen(false)}
                        title={collapsed ? label : undefined}
                        className={cn(
                          "group relative flex items-center rounded-lg text-[13px] transition-all duration-100",
                          collapsed
                            ? "lg:justify-center lg:px-0 lg:py-[9px] gap-2.5 px-2.5 py-[7px]"
                            : "gap-2.5 px-2.5 py-[7px]",
                          active
                            ? "bg-white/[0.10] font-semibold text-white"
                            : "font-medium text-white/40 hover:bg-white/[0.05] hover:text-white/75"
                        )}
                      >
                        {/* Active stripe — hidden when collapsed */}
                        {active && !collapsed && (
                          <span className="absolute left-0 top-1/2 h-[18px] w-[3px] -translate-y-1/2 rounded-r-full bg-amber-400" />
                        )}
                        {/* Active dot when collapsed */}
                        {active && collapsed && (
                          <span className="absolute right-1 top-1 hidden h-1.5 w-1.5 rounded-full bg-amber-400 lg:block" />
                        )}
                        <Icon
                          className={cn(
                            "shrink-0 transition-colors",
                            collapsed ? "lg:h-[18px] lg:w-[18px] h-4 w-4" : "h-4 w-4",
                            active ? "text-white" : "text-white/35 group-hover:text-white/60"
                          )}
                          strokeWidth={1.6}
                        />
                        <span className={cn("flex-1 truncate", collapsed && "lg:hidden")}>
                          {label}
                        </span>
                        {badge && (
                          <span className={cn(
                            "flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none text-white",
                            badgeGold ? "bg-amber-500" : "bg-white/[0.12]",
                            collapsed && "lg:hidden"
                          )}>
                            {badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-white/[0.07] p-2">
          <div className={cn(
            "flex items-center gap-2.5 rounded-lg px-2 py-2",
            collapsed && "lg:justify-center lg:px-0"
          )}>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-[11px] font-bold text-amber-400 ring-1 ring-amber-400/20">
              LX
            </div>
            <div className={cn("min-w-0 flex-1", collapsed && "lg:hidden")}>
              <p className="truncate text-[12px] font-semibold text-white/80">Admin</p>
              <p className="truncate text-[10px] text-white/30">Luxonair</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/25 transition-colors hover:bg-white/8 hover:text-white/70",
                collapsed && "lg:hidden"
              )}
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
          {/* Expand button shown only when collapsed on desktop */}
          {collapsed && (
            <button
              onClick={toggleCollapsed}
              title="Expand sidebar"
              className="hidden lg:flex w-full items-center justify-center rounded-lg py-1.5 text-white/25 transition-colors hover:bg-white/8 hover:text-white/70"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex h-[60px] shrink-0 items-center gap-3 border-b border-gray-200/70 bg-white px-4 lg:px-6">

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Breadcrumb */}
          <div className="hidden items-center gap-1.5 text-sm lg:flex">
            <span className="text-gray-400">Admin</span>
            {activeItem && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                <span className="font-semibold text-gray-800">{activeItem.label}</span>
              </>
            )}
          </div>
          <p className="text-sm font-semibold text-gray-800 lg:hidden">{activeItem?.label ?? "Admin"}</p>

          <div className="flex flex-1 items-center justify-end gap-2">
            {/* Search */}
            <div className="hidden cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 transition-colors hover:border-gray-300 sm:flex">
              <Search className="h-3.5 w-3.5 text-gray-400" />
              <span className="select-none text-[12px] text-gray-400">Search…</span>
              <kbd className="ml-4 rounded border border-gray-200 bg-white px-1.5 py-px text-[10px] font-medium text-gray-400">⌘K</kbd>
            </div>

            {/* Bell */}
            <button className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800">
              <Bell className="h-4 w-4" />
              <span className="absolute right-[7px] top-[7px] h-1.5 w-1.5 rounded-full bg-amber-400 ring-[1.5px] ring-white" />
            </button>

            <div className="h-5 w-px bg-gray-100" />

            {/* User pill */}
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 py-1 pl-1 pr-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#031e3e] text-[10px] font-bold text-white">
                LX
              </div>
              <div className="hidden sm:block">
                <p className="text-[12px] font-semibold text-gray-800 leading-none">Admin</p>
                <p className="text-[10px] text-gray-400 leading-none mt-0.5">Luxonair</p>
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
