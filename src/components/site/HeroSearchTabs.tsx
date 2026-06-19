import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plane, Package } from "lucide-react";

export function HeroSearchTabs() {
  const [tab, setTab] = useState<"package" | "flight">("package");
  return (
    <div className="container-page relative z-10 -mb-12 md:-mb-16">
      <div className="overflow-hidden rounded-2xl bg-card shadow-[0_20px_64px_-8px_rgba(4,32,69,0.24)] ring-1 ring-navy/8">
        {/* Tab bar */}
        <div className="flex gap-1 bg-secondary px-4 pt-3">
          <Tab active={tab === "package"} onClick={() => setTab("package")} icon={Package}>
            Packages
          </Tab>
          <Tab active={tab === "flight"} onClick={() => setTab("flight")} icon={Plane}>
            Flights
          </Tab>
        </div>
        {/* Brand accent line — teal → gold → aqua */}
        <div className="h-0.5 bg-linear-to-r from-teal via-gold to-aqua opacity-80" />
        {tab === "package" ? <PackageForm /> : <FlightForm />}
      </div>
    </div>
  );
}

function Tab({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Plane;
  children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-t-lg px-5 py-2.5 text-sm font-semibold transition-all ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-card hover:text-foreground"
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
      className="grid gap-3 p-5 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-end"
    >
      <Field label="Where to?">
        <input
          name="destination"
          placeholder="Maldives, Tokyo, anywhere warm"
          className="input-field"
        />
      </Field>
      <Field label="When">
        <input name="when" placeholder="October half-term" className="input-field" />
      </Field>
      <Field label="Travellers">
        <input name="travellers" placeholder="2 adults" className="input-field" />
      </Field>
      <Button
        type="submit"
        size="lg"
        className="h-11 bg-gold text-gold-foreground hover:bg-gold/90"
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
      className="grid gap-3 p-5 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] sm:items-end"
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
        className="h-11 bg-gold text-gold-foreground hover:bg-gold/90"
      >
        Get a quote
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
