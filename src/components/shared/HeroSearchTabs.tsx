import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plane, Package, ChevronUp, ChevronDown, Search } from "lucide-react";
import "flag-icons/css/flag-icons.min.css";
import { DatePicker } from "./DatePicker";
import { AIRPORTS, type Airport } from "@/data/airports";

// ─── Inline flag using bundled SVG via flag-icons CSS ────────────────────────
function Flag({ code, size = 18 }: { code: string; size?: number }) {
  return (
    <span
      className={`fi fi-${code} shrink-0 rounded-sm`}
      style={{ width: `${Math.round(size * 1.333)}px`, height: `${size}px` }}
    />
  );
}

function airportLabel(a: Airport) {
  return a.airportName
    ? `${a.cityName} ${a.airportName} (${a.code})`
    : `${a.cityName} (${a.code})`;
}

// ─── Common shorthand country search terms not present in the full country name ──
const COUNTRY_ALIASES: Record<string, string> = {
  uk: "united kingdom",
  usa: "united states",
  us: "united states",
  uae: "united arab emirates",
};

// ─── Searchable airport dropup — search by city, IATA code, or country ───────
function AirportSelect({
  name,
  placeholder,
  defaultAirportCode = "",
}: {
  name: string;
  placeholder: string;
  defaultAirportCode?: string;
}) {
  const defaultAirport = AIRPORTS.find((a) => a.code === defaultAirportCode);
  const defaultLabel = defaultAirport ? airportLabel(defaultAirport) : "";

  const [query, setQuery] = useState(defaultLabel);
  const [selected, setSelected] = useState(defaultLabel);
  const [selectedCode, setSelectedCode] = useState(defaultAirportCode);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedAirport = AIRPORTS.find((a) => a.code === selectedCode);

  const filtered = useMemo(() => {
    const raw = query.trim().toLowerCase();
    if (!raw || query === selected) return AIRPORTS;
    const q = COUNTRY_ALIASES[raw] ?? raw;
    return AIRPORTS.filter(
      (a) =>
        a.cityName.toLowerCase().includes(q) ||
        a.airportName.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.countryCode.toLowerCase() === raw
    );
  }, [query, selected]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery(selected);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [query, selected]);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery(selected);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selected]);

  function pick(airport: Airport) {
    const label = airportLabel(airport);
    setSelected(label);
    setSelectedCode(airport.code);
    setQuery(label);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={selected} />
      <input type="hidden" name={`${name}Code`} value={selectedCode} />

      {/* Trigger input */}
      <div className="relative">
        {selectedAirport && !open ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <Flag code={selectedAirport.countryCode} size={14} />
          </span>
        ) : (
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          className="input-field pl-10 pr-8"
          onFocus={() => {
            setQuery("");
            setOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
        />
        <ChevronUp
          className={`pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground transition-transform ${
            open ? "" : "rotate-180"
          }`}
        />
      </div>

      {/* Dropup — opens upward */}
      {open && (
        <div className="absolute bottom-full left-0 z-50 mb-1.5 flex max-h-72 w-full min-w-72 flex-col gap-0.5 overflow-y-auto rounded-xl border border-border bg-background p-1.5 shadow-2xl">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              No airports found
            </p>
          ) : (
            filtered.map((a) => (
              <button
                key={a.code}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(a);
                }}
                className={`flex w-full items-start gap-3 rounded-lg border-l-4 px-3 py-2 text-left transition-colors ${
                  selectedCode === a.code
                    ? "border-l-primary bg-muted"
                    : "border-l-transparent hover:border-l-primary hover:bg-muted"
                }`}
              >
                <Flag code={a.countryCode} size={18} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-foreground">
                    <span className="font-semibold">{a.cityName}</span>
                    {a.airportName ? ` ${a.airportName}` : ""} ({a.code})
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {a.country}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main widget ──────────────────────────────────────────────────────────────
export function HeroSearchTabs() {
  const [tab, setTab] = useState<"package" | "flight">("package");
  return (
    <div className="container-page relative z-10">
      <div className="rounded-2xl bg-card shadow-[0_20px_64px_-8px_rgba(4,32,69,0.24)] ring-1 ring-navy/8">
        {/* Tab bar */}
        <div
          role="tablist"
          aria-label="Search type"
          className="flex gap-1 rounded-t-2xl bg-muted/70 px-4 pt-3"
        >
          <Tab
            active={tab === "package"}
            onClick={() => setTab("package")}
            icon={Package}
            panelId="panel-package"
            tabId="tab-package"
          >
            Packages
          </Tab>
          <Tab
            active={tab === "flight"}
            onClick={() => setTab("flight")}
            icon={Plane}
            panelId="panel-flight"
            tabId="tab-flight"
          >
            Flights
          </Tab>
        </div>
        {/* Brand accent line */}
        <div className="h-0.5 bg-linear-to-r from-teal via-gold to-aqua opacity-80" />
        {tab === "package" ? (
          <div id="panel-package" role="tabpanel" aria-labelledby="tab-package">
            <PackageForm />
          </div>
        ) : (
          <div id="panel-flight" role="tabpanel" aria-labelledby="tab-flight">
            <FlightForm />
          </div>
        )}
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
      className="grid grid-cols-2 gap-2.5 p-4 sm:gap-3 sm:p-5 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto] lg:items-end"
    >
      <Field label="Where to?" className="col-span-2 lg:col-span-1">
        <input
          name="destination"
          placeholder="Maldives, Tokyo, anywhere warm"
          className="input-field"
        />
      </Field>
      <Field label="Depart">
        <DatePicker name="depart" placeholder="Departure date" />
      </Field>
      <Field label="Return (optional)">
        <DatePicker name="return" placeholder="Return date (optional)" />
      </Field>
      <Field label="Travellers">
        <input name="travellers" placeholder="2 adults" className="input-field" />
      </Field>
      <Field label="Cabin">
        <CabinSelect name="cabin" />
      </Field>
      <Button
        type="submit"
        size="lg"
        className="col-span-2 h-11 w-full bg-gold text-gold-foreground hover:bg-gold/90 lg:col-span-1 lg:w-auto"
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
      className="grid grid-cols-2 gap-2.5 p-4 sm:gap-3 sm:p-5 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] lg:items-end"
    >
      <input type="hidden" name="tripType" value="Flight only" />
      <Field label="From">
        <AirportSelect
          name="from"
          placeholder="Departure airport"
          defaultAirportCode="LHR"
        />
      </Field>
      <Field label="To">
        <AirportSelect name="destination" placeholder="Where to?" />
      </Field>
      <Field label="Depart">
        <DatePicker name="depart" placeholder="Departure date" />
      </Field>
      <Field label="Return (optional)">
        <DatePicker name="return" placeholder="Return date (optional)" />
      </Field>
      <Field label="Cabin">
        <CabinSelect name="cabin" />
      </Field>
      <Button
        type="submit"
        size="lg"
        className="col-span-2 h-11 w-full bg-gold text-gold-foreground hover:bg-gold/90 lg:col-span-1 lg:w-auto"
      >
        Get a quote
      </Button>
    </form>
  );
}

function CabinSelect({ name }: { name: string }) {
  return (
    <div className="relative">
      <select
        name={name}
        className="input-field appearance-none pr-8"
      >
        <option>Economy</option>
        <option>Premium economy</option>
        <option>Business</option>
        <option>First</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}
