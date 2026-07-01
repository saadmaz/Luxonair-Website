// Inline flag using bundled SVG via the flag-icons CSS sprite.
import "flag-icons/css/flag-icons.min.css";

export function Flag({ code, size = 18 }: { code: string; size?: number }) {
  return (
    <span
      className={`fi fi-${code} shrink-0 rounded-sm`}
      style={{ width: `${Math.round(size * 1.333)}px`, height: `${size}px` }}
    />
  );
}
