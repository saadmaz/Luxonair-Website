import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

type StatDef =
  | { kind: "count"; prefix: string; target: number; suffix: string; decimals: number; label: string }
  | { kind: "text"; text: string; label: string };

const stats: StatDef[] = [
  { kind: "count", prefix: "",  target: 500, suffix: "+",  decimals: 0, label: "Premium trips delivered" },
  { kind: "count", prefix: "",  target: 4.9, suffix: "★",  decimals: 1, label: "Average client rating"   },
  { kind: "text",  text: "£0",                              label: "Booking fees, ever"      },
  { kind: "text",  text: "Same day",                        label: "Quote turnaround"        },
];

function CountUp({ target, prefix, suffix, decimals, active }: {
  target: number; prefix: string; suffix: string; decimals: number; active: boolean;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let rafId: number;
    const startTime = performance.now();
    const duration = 1800;
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(+(target * eased).toFixed(decimals));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [active, target, decimals]);
  return <>{prefix}{decimals > 0 ? count.toFixed(decimals) : count}{suffix}</>;
}

export function StatsStrip() {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div className="bg-navy" ref={ref}>
      <div className="container-page grid grid-cols-2 divide-x divide-white/10 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={[
              "flex flex-col items-center gap-1.5 px-4 py-8 text-center transition-all duration-700",
              i < 2 ? "border-b border-white/10 lg:border-b-0" : "",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            ].join(" ")}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <span className="font-display text-3xl font-bold text-gold sm:text-4xl">
              {s.kind === "count" ? (
                <CountUp
                  target={s.target}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  decimals={s.decimals}
                  active={inView}
                />
              ) : (
                s.text
              )}
            </span>
            <span className="text-[11px] font-medium tracking-wide text-navy-fg/55 sm:text-xs">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
