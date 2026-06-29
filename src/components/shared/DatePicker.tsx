import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  name: string;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
}

export function DatePicker({
  name,
  placeholder = "Select date",
  disabled,
  minDate,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | undefined>();

  function pick(date: Date | undefined) {
    setSelected(date);
    if (date) setOpen(false);
  }

  return (
    <>
      {/* Carries the value for native form submission */}
      <input
        type="hidden"
        name={name}
        value={selected ? format(selected, "yyyy-MM-dd") : ""}
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "input-field flex w-full items-center gap-2.5 text-left",
              !selected && "text-muted-foreground",
            )}
          >
            <CalendarDays className="h-4 w-4 shrink-0 text-gold" />
            <span className="flex-1 truncate text-sm">
              {selected ? format(selected, "EEE d MMM yyyy") : placeholder}
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto overflow-hidden rounded-2xl border-border p-0 shadow-2xl"
          align="start"
          sideOffset={6}
        >
          {/* ── Navy brand header ─────────────────────── */}
          <div className="bg-navy px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-fg/50">
              Departure date
            </p>
            <p className="mt-1 font-display text-xl font-bold text-navy-fg">
              {selected ? format(selected, "EEEE, d MMMM") : "Choose a date"}
            </p>
            {selected && (
              <p className="mt-0.5 text-xs text-gold">
                {format(selected, "yyyy")}
              </p>
            )}
          </div>

          {/* ── Calendar — gold selected, teal today ─── */}
          <div
            className="bg-background"
            style={
              {
                "--primary": "var(--gold)",
                "--primary-foreground": "var(--gold-foreground)",
              } as React.CSSProperties
            }
          >
            <Calendar
              mode="single"
              selected={selected}
              onSelect={pick}
              disabled={minDate ? { before: minDate } : undefined}
              autoFocus
              classNames={{
                today:
                  "bg-teal/15 text-teal rounded-md font-semibold data-[selected=true]:rounded-md",
              }}
            />

            {/* Clear link */}
            {selected && (
              <div className="border-t border-border px-4 py-2.5 text-right">
                <button
                  type="button"
                  onClick={() => setSelected(undefined)}
                  className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Clear date
                </button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
