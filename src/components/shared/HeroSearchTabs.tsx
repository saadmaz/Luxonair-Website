// Quick-search widget shown at the bottom of the Hero section.
// Both forms submit as GET to /quote, pre-filling QuoteForm fields via URL params.
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plane, Package } from "lucide-react";

export function HeroSearchTabs() {
  const [tab, setTab] = useState<"package" | "flight">("package");
  return (
    <div className="container-page relative z-10">
      <div className="overflow-hidden rounded-2xl bg-card shadow-[0_20px_64px_-8px_rgba(4,32,69,0.24)] ring-1 ring-navy/8">
        {/* Tab bar */}
        <div role="tablist" aria-label="Search type" className="flex gap-1 bg-muted/70 px-4 pt-3">
          <Tab active={tab === "package"} onClick={() => setTab("package")} icon={Package} panelId="panel-package" tabId="tab-package">
            Packages
          </Tab>
          <Tab active={tab === "flight"} onClick={() => setTab("flight")} icon={Plane} panelId="panel-flight" tabId="tab-flight">
            Flights
          </Tab>
        </div>
        {/* Brand accent line - teal → gold → aqua */}
        <div className="h-0.5 bg-linear-to-r from-teal via-gold to-aqua opacity-80" />
        {tab === "package"
          ? <div id="panel-package" role="tabpanel" aria-labelledby="tab-package"><PackageForm /></div>
          : <div id="panel-flight" role="tabpanel" aria-labelledby="tab-flight"><FlightForm /></div>
        }
      </div>
    </div>
  );
}

function Tab({
  active,
  onClick,
  icon: Icon,
  panelId,
  tabId,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Plane;
  panelId: string;
  tabId: string;
  children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      id={tabId}
      aria-selected={active}
      aria-controls={panelId}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-t-lg px-5 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" /> {children}
    </button>
  );
}

function PackageForm() {
  return (
    <form
      action="/quote"
      method="get"
      className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto] lg:items-end"
    >
      <Field label="Where to?" className="sm:col-span-2 lg:col-span-1">
        <input
          name="destination"
          placeholder="Maldives, Tokyo, anywhere warm"
          className="input-field"
        />
      </Field>
      <Field label="Depart">
        <input name="depart" type="date" className="input-field" />
      </Field>
      <Field label="Return">
        <input name="return" type="date" className="input-field" />
      </Field>
      <Field label="Travellers">
        <input name="travellers" placeholder="2 adults" className="input-field" />
      </Field>
      <Field label="Cabin">
        <select name="cabin" className="input-field">
          <option>Economy</option>
          <option>Premium economy</option>
          <option>Business</option>
          <option>First</option>
        </select>
      </Field>
      <Button
        type="submit"
        size="lg"
        className="h-11 w-full bg-gold text-gold-foreground hover:bg-gold/90 sm:col-span-2 lg:col-span-1 lg:w-auto"
      >
        Get a quote
      </Button>
    </form>
  );
}

function FlightForm() {
  return (
    <form
      action="/quote"
      method="get"
      className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] lg:items-end"
    >
      <input type="hidden" name="tripType" value="Flight only" />
      <Field label="From">
        <input name="from" placeholder="London (any)" className="input-field" />
      </Field>
      <Field label="To">
        <input name="destination" placeholder="Dubai" className="input-field" />
      </Field>
      <Field label="Depart">
        <input name="depart" type="date" className="input-field" />
      </Field>
      <Field label="Return (optional)">
        <input name="return" type="date" className="input-field" />
      </Field>
      <Field label="Cabin">
        <select name="cabin" className="input-field">
          <option>Economy</option>
          <option>Premium economy</option>
          <option>Business</option>
          <option>First</option>
        </select>
      </Field>
      <Button
        type="submit"
        size="lg"
        className="h-11 w-full bg-gold text-gold-foreground hover:bg-gold/90 sm:col-span-2 lg:col-span-1 lg:w-auto"
      >
        Get a quote
      </Button>
    </form>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block${className ? ` ${className}` : ""}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
