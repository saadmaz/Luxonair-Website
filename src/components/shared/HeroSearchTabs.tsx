import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plane, Package, ChevronDown, Search } from "lucide-react";

// ─── Country data ─────────────────────────────────────────────────────────────
const COUNTRIES = [
  { name: "United Kingdom",        flag: "🇬🇧" },
  { name: "United States",         flag: "🇺🇸" },
  { name: "United Arab Emirates",  flag: "🇦🇪" },
  { name: "France",                flag: "🇫🇷" },
  { name: "Spain",                 flag: "🇪🇸" },
  { name: "Italy",                 flag: "🇮🇹" },
  { name: "Greece",                flag: "🇬🇷" },
  { name: "Portugal",              flag: "🇵🇹" },
  { name: "Germany",               flag: "🇩🇪" },
  { name: "Netherlands",           flag: "🇳🇱" },
  { name: "Switzerland",           flag: "🇨🇭" },
  { name: "Austria",               flag: "🇦🇹" },
  { name: "Turkey",                flag: "🇹🇷" },
  { name: "Egypt",                 flag: "🇪🇬" },
  { name: "Morocco",               flag: "🇲🇦" },
  { name: "South Africa",          flag: "🇿🇦" },
  { name: "Kenya",                 flag: "🇰🇪" },
  { name: "Tanzania",              flag: "🇹🇿" },
  { name: "Maldives",              flag: "🇲🇻" },
  { name: "Sri Lanka",             flag: "🇱🇰" },
  { name: "India",                 flag: "🇮🇳" },
  { name: "Thailand",              flag: "🇹🇭" },
  { name: "Japan",                 flag: "🇯🇵" },
  { name: "China",                 flag: "🇨🇳" },
  { name: "Singapore",             flag: "🇸🇬" },
  { name: "Indonesia",             flag: "🇮🇩" },
  { name: "Vietnam",               flag: "🇻🇳" },
  { name: "Cambodia",              flag: "🇰🇭" },
  { name: "Philippines",           flag: "🇵🇭" },
  { name: "Malaysia",              flag: "🇲🇾" },
  { name: "Hong Kong",             flag: "🇭🇰" },
  { name: "South Korea",           flag: "🇰🇷" },
  { name: "Australia",             flag: "🇦🇺" },
  { name: "New Zealand",           flag: "🇳🇿" },
  { name: "Canada",                flag: "🇨🇦" },
  { name: "Mexico",                flag: "🇲🇽" },
  { name: "Brazil",                flag: "🇧🇷" },
  { name: "Argentina",             flag: "🇦🇷" },
  { name: "Peru",                  flag: "🇵🇪" },
  { name: "Colombia",              flag: "🇨🇴" },
  { name: "Cuba",                  flag: "🇨🇺" },
  { name: "Jamaica",               flag: "🇯🇲" },
  { name: "Barbados",              flag: "🇧🇧" },
  { name: "Antigua & Barbuda",     flag: "🇦🇬" },
  { name: "Dominican Republic",    flag: "🇩🇴" },
  { name: "Bahamas",               flag: "🇧🇸" },
  { name: "Saint Lucia",           flag: "🇱🇨" },
  { name: "Trinidad & Tobago",     flag: "🇹🇹" },
  { name: "Qatar",                 flag: "🇶🇦" },
  { name: "Saudi Arabia",          flag: "🇸🇦" },
  { name: "Bahrain",               flag: "🇧🇭" },
  { name: "Kuwait",                flag: "🇰🇼" },
  { name: "Oman",                  flag: "🇴🇲" },
  { name: "Jordan",                flag: "🇯🇴" },
  { name: "Israel",                flag: "🇮🇱" },
  { name: "Cyprus",                flag: "🇨🇾" },
  { name: "Malta",                 flag: "🇲🇹" },
  { name: "Iceland",               flag: "🇮🇸" },
  { name: "Norway",                flag: "🇳🇴" },
  { name: "Sweden",                flag: "🇸🇪" },
  { name: "Denmark",               flag: "🇩🇰" },
  { name: "Finland",               flag: "🇫🇮" },
  { name: "Ireland",               flag: "🇮🇪" },
  { name: "Croatia",               flag: "🇭🇷" },
  { name: "Montenegro",            flag: "🇲🇪" },
  { name: "Albania",               flag: "🇦🇱" },
  { name: "Georgia",               flag: "🇬🇪" },
  { name: "Armenia",               flag: "🇦🇲" },
  { name: "Azerbaijan",            flag: "🇦🇿" },
  { name: "Pakistan",              flag: "🇵🇰" },
  { name: "Bangladesh",            flag: "🇧🇩" },
  { name: "Nepal",                 flag: "🇳🇵" },
  { name: "Ethiopia",              flag: "🇪🇹" },
  { name: "Ghana",                 flag: "🇬🇭" },
  { name: "Nigeria",               flag: "🇳🇬" },
  { name: "Mauritius",             flag: "🇲🇺" },
  { name: "Seychelles",            flag: "🇸🇨" },
  { name: "Zanzibar",              flag: "🇹🇿" },
].sort((a, b) => a.name.localeCompare(b.name));

// ─── Searchable country dropdown ──────────────────────────────────────────────
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

  const filtered = query
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : COUNTRIES;

  // Close on click outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        // Restore selected value if user typed but didn't pick
        if (!COUNTRIES.find((c) => c.name === query)) {
          setQuery(selected);
        }
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [query, selected]);

  // Close on ESC
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

  function pick(country: { name: string; flag: string }) {
    setSelected(country.name);
    setQuery(country.name);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Hidden input carries the value for form submission */}
      <input type="hidden" name={name} value={selected} />

      {/* Visible search input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          className="input-field pl-8 pr-8"
          onFocus={() => {
            setQuery("");
            setOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
        />
        <ChevronDown
          className={`pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown list */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-background shadow-xl">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">No countries found</p>
          ) : (
            filtered.map((c) => (
              <button
                key={c.name}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent blur before click registers
                  pick(c);
                }}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted ${
                  selected === c.name ? "bg-muted font-medium text-primary" : "text-foreground"
                }`}
              >
                <span className="text-base leading-none">{c.flag}</span>
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
        <div role="tablist" aria-label="Search type" className="flex gap-1 rounded-t-2xl bg-muted/70 px-4 pt-3">
          <Tab active={tab === "package"} onClick={() => setTab("package")} icon={Package} panelId="panel-package" tabId="tab-package">
            Packages
          </Tab>
          <Tab active={tab === "flight"} onClick={() => setTab("flight")} icon={Plane} panelId="panel-flight" tabId="tab-flight">
            Flights
          </Tab>
        </div>
        {/* Brand accent line */}
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
  active, onClick, icon: Icon, panelId, tabId, children,
}: {
  active: boolean; onClick: () => void; icon: typeof Plane;
  panelId: string; tabId: string; children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      id={tabId}
      aria-selected={active}
      aria-controls={panelId}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-t-lg px-5 py-2.5 text-sm font-medium transition-all ${
        active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
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
        <input name="destination" placeholder="Maldives, Tokyo, anywhere warm" className="input-field" />
      </Field>
      <Field label="Depart">
        <input name="depart" type="date" className="input-field" />
      </Field>
      <Field label="Return (optional)">
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
      <Button type="submit" size="lg" className="col-span-2 h-11 w-full bg-gold text-gold-foreground hover:bg-gold/90 lg:col-span-1 lg:w-auto">
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
        <CountrySelect name="from" placeholder="London (any)" defaultValue="United Kingdom" />
      </Field>
      <Field label="To">
        <CountrySelect name="destination" placeholder="Where to?" />
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
      <Button type="submit" size="lg" className="col-span-2 h-11 w-full bg-gold text-gold-foreground hover:bg-gold/90 lg:col-span-1 lg:w-auto">
        Get a quote
      </Button>
    </form>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}
