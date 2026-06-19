import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/holiday-types")({
  component: () => <Outlet />,
});

export function HolidayTypeBreadcrumb({ name }: { name?: string }) {
  return (
    <nav className="text-xs text-muted-foreground">
      <Link to="/" className="hover:text-foreground">Home</Link>
      <span className="mx-2">/</span>
      <Link to="/holiday-types" className="hover:text-foreground">Holiday types</Link>
      {name && (<><span className="mx-2">/</span><span className="text-foreground">{name}</span></>)}
    </nav>
  );
}
