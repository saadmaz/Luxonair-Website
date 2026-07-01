// Searchable airport combobox for admin forms — same data/flags as the
// homepage Hero search widget, but controlled (value = IATA code) so it can
// live inside a React-state form object instead of a native <form>.
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Flag } from "@/components/shared/Flag";
import { AIRPORTS, airportLabel, findAirport } from "@/data/airports";

const COUNTRY_ALIASES: Record<string, string> = {
  uk: "united kingdom",
  usa: "united states",
  us: "united states",
  uae: "united arab emirates",
};

type Props = {
  label: string;
  value: string;
  onChange: (code: string) => void;
};

export function AirportPicker({ label, value, onChange }: Props) {
  const selectedAirport = findAirport(value);
  const [query, setQuery] = useState(selectedAirport ? airportLabel(selectedAirport) : "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const a = findAirport(value);
    setQuery(a ? airportLabel(a) : "");
  }, [value]);

  const filtered = useMemo(() => {
    const raw = query.trim().toLowerCase();
    const selectedLabel = selectedAirport ? airportLabel(selectedAirport) : "";
    if (!raw || query === selectedLabel) return AIRPORTS;
    const q = COUNTRY_ALIASES[raw] ?? raw;
    return AIRPORTS.filter(
      (a) =>
        a.cityName.toLowerCase().includes(q) ||
        a.airportName.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.countryCode.toLowerCase() === raw,
    );
  }, [query, selectedAirport]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery(selectedAirport ? airportLabel(selectedAirport) : "");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [selectedAirport]);

  function pick(code: string) {
    onChange(code);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {selectedAirport && !open ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <Flag code={selectedAirport.countryCode} size={14} />
          </span>
        ) : (
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
        )}
        <input
          type="text"
          value={query}
          placeholder="Search city, airport or code"
          autoComplete="off"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-sm text-gray-900 outline-none focus:border-[#042045] focus:bg-white focus:ring-2 focus:ring-[#042045]/10"
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
          className={`pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 flex max-h-64 w-full min-w-72 flex-col gap-0.5 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-2xl">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">No airports found</p>
          ) : (
            filtered.map((a) => (
              <button
                key={a.code}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(a.code);
                }}
                className={`flex w-full items-center gap-3 rounded-lg border-l-4 px-3 py-2 text-left transition-colors ${
                  value === a.code
                    ? "border-l-[#042045] bg-gray-50"
                    : "border-l-transparent hover:border-l-[#042045] hover:bg-gray-50"
                }`}
              >
                <Flag code={a.countryCode} size={18} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-gray-900">
                    <span className="font-semibold">{a.cityName}</span>
                    {a.airportName ? ` ${a.airportName}` : ""} ({a.code})
                  </span>
                  <span className="block truncate text-xs text-gray-400">{a.country}</span>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
