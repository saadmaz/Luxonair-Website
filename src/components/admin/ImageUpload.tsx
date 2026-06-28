import { useState } from "react";
import { ImageIcon, X } from "lucide-react";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export function ImageUpload({ value, onChange, label = "Image" }: Props) {
  const [draft, setDraft] = useState(value);

  const commit = () => {
    const trimmed = draft.trim();
    onChange(trimmed);
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {value ? (
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          <img src={value} alt="Preview" className="h-48 w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => { onChange(""); setDraft(""); }}
              className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-red-700"
            >
              <X className="h-3 w-3" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-40 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
            <ImageIcon className="h-5 w-5 text-gray-500" />
          </div>
          <p className="text-xs text-gray-400">No image — paste a URL below</p>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="url"
          placeholder="https://images.unsplash.com/..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), commit())}
          className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 focus:border-[#042045] focus:outline-none focus:ring-1 focus:ring-[#042045]"
        />
        {draft !== value && (
          <button
            type="button"
            onClick={commit}
            className="rounded-md bg-[#042045] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#042045]/90"
          >
            Set
          </button>
        )}
      </div>
    </div>
  );
}
