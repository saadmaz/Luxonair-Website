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
    const duration = 2000;
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
      <div className="container-page grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={[
              "flex flex-col items-center gap-3 px-6 py-12 text-center transition-all duration-700",
              i < 2 ? "border-b border-white/[0.07] lg:border-b-0" : "",
              i % 2 === 0 ? "border-r border-white/[0.07] lg:border-r-0" : "",
              "lg:[&:not(:last-child)]:border-r lg:border-white/[0.07]",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            ].join(" ")}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <span className="font-display text-4xl font-light tracking-tight text-gold sm:text-5xl">
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
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-navy-fg/35">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
