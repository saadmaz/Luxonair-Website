import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plane, Package, ChevronUp, ChevronDown, Search } from "lucide-react";
import "flag-icons/css/flag-icons.min.css";
import { DatePicker } from "./DatePicker";

// ─── Country data with ISO-2 codes for flag-icons ────────────────────────────
const COUNTRIES = [
  { name: "Albania",              code: "al" },
  { name: "Antigua & Barbuda",   code: "ag" },
  { name: "Argentina",           code: "ar" },
  { name: "Armenia",             code: "am" },
  { name: "Australia",           code: "au" },
  { name: "Austria",             code: "at" },
  { name: "Azerbaijan",          code: "az" },
  { name: "Bahamas",             code: "bs" },
  { name: "Bahrain",             code: "bh" },
  { name: "Bangladesh",          code: "bd" },
  { name: "Barbados",            code: "bb" },
  { name: "Brazil",              code: "br" },
  { name: "Cambodia",            code: "kh" },
  { name: "Canada",              code: "ca" },
  { name: "China",               code: "cn" },
  { name: "Colombia",            code: "co" },
  { name: "Croatia",             code: "hr" },
  { name: "Cuba",                code: "cu" },
  { name: "Cyprus",              code: "cy" },
  { name: "Denmark",             code: "dk" },
  { name: "Dominican Republic",  code: "do" },
  { name: "Egypt",               code: "eg" },
  { name: "Ethiopia",            code: "et" },
  { name: "Finland",             code: "fi" },
  { name: "France",              code: "fr" },
  { name: "Georgia",             code: "ge" },
  { name: "Germany",             code: "de" },
  { name: "Ghana",               code: "gh" },
  { name: "Greece",              code: "gr" },
  { name: "Hong Kong",           code: "hk" },
  { name: "Iceland",             code: "is" },
  { name: "India",               code: "in" },
  { name: "Indonesia",           code: "id" },
  { name: "Ireland",             code: "ie" },
  { name: "Israel",              code: "il" },
  { name: "Italy",               code: "it" },
  { name: "Jamaica",             code: "jm" },
  { name: "Japan",               code: "jp" },
  { name: "Jordan",              code: "jo" },
  { name: "Kenya",               code: "ke" },
  { name: "Kuwait",              code: "kw" },
  { name: "Malaysia",            code: "my" },
  { name: "Maldives",            code: "mv" },
  { name: "Malta",               code: "mt" },
  { name: "Mauritius",           code: "mu" },
  { name: "Mexico",              code: "mx" },
  { name: "Montenegro",          code: "me" },
  { name: "Morocco",             code: "ma" },
  { name: "Nepal",               code: "np" },
  { name: "Netherlands",         code: "nl" },
  { name: "New Zealand",         code: "nz" },
  { name: "Nigeria",             code: "ng" },
  { name: "Norway",              code: "no" },
  { name: "Oman",                code: "om" },
  { name: "Pakistan",            code: "pk" },
  { name: "Peru",                code: "pe" },
  { name: "Philippines",         code: "ph" },
  { name: "Portugal",            code: "pt" },
  { name: "Qatar",               code: "qa" },
  { name: "Saint Lucia",         code: "lc" },
  { name: "Saudi Arabia",        code: "sa" },
  { name: "Seychelles",          code: "sc" },
  { name: "Singapore",           code: "sg" },
  { name: "South Africa",        code: "za" },
  { name: "South Korea",         code: "kr" },
  { name: "Spain",               code: "es" },
  { name: "Sri Lanka",           code: "lk" },
  { name: "Sweden",              code: "se" },
  { name: "Switzerland",         code: "ch" },
  { name: "Tanzania",            code: "tz" },
  { name: "Thailand",            code: "th" },
  { name: "Trinidad & Tobago",   code: "tt" },
  { name: "Turkey",              code: "tr" },
  { name: "United Arab Emirates",code: "ae" },
  { name: "United Kingdom",      code: "gb" },
  { name: "United States",       code: "us" },
  { name: "Vietnam",             code: "vn" },
  { name: "Zanzibar",            code: "tz" },
].sort((a, b) => a.name.localeCompare(b.name));

// ─── Inline flag using bundled SVG via flag-icons CSS ────────────────────────
function Flag({ code, size = 18 }: { code: string; size?: number }) {
  return (
    <span
      className={`fi fi-${code} shrink-0 rounded-sm`}
      style={{ width: `${Math.round(size * 1.333)}px`, height: `${size}px` }}
    />
  );
}

// ─── Searchable country dropup ────────────────────────────────────────────────
function CountrySelect({
  name,
  placeholder,
  defaultValue = "",
}: {
  name: string;
  placeholder: string;
  defaultValue?: string;
}) {
  const [query, setQuery] = useState(defaultValue);
  const [selected, setSelected] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = COUNTRIES.find((c) => c.name === selected);

  const filtered =
    query && !COUNTRIES.find((c) => c.name === query)
      ? COUNTRIES.filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase())
        )
      : COUNTRIES;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        if (!COUNTRIES.find((c) => c.name === query)) setQuery(selected);
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

  function pick(country: { name: string; code: string }) {
    setSelected(country.name);
    setQuery(country.name);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={selected} />

      {/* Trigger input */}
      <div className="relative">
        {selectedCountry && !open ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <Flag code={selectedCountry.code} size={14} />
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
        <div className="absolute bottom-full left-0 z-50 mb-1.5 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-background shadow-2xl">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              No countries found
            </p>
          ) : (
            filtered.map((c) => (
              <button
                key={c.name + c.code}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(c);
                }}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted ${
                  selected === c.name
                    ? "bg-muted font-medium text-primary"
                    : "text-foreground"
                }`}
              >
                <Flag code={c.code} size={14} />
                <span>{c.name}</span>
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
        <CountrySelect
          name="from"
          placeholder="London (any)"
          defaultValue="United Kingdom"
        />
      </Field>
      <Field label="To">
        <CountrySelect name="destination" placeholder="Where to?" />
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
