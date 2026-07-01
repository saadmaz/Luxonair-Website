import { useRef, useState } from "react";
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 8 * 1024 * 1024;

export function ImageUpload({ value, onChange, label = "Image" }: Props) {
  const [draft, setDraft] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = () => {
    const trimmed = draft.trim();
    onChange(trimmed);
  };

  async function upload(file: File) {
    setError("");
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Use a JPG, PNG, WEBP or GIF image");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image is too large (max 8MB)");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Upload failed");
      }
      const { url } = (await res.json()) as { url: string };
      setDraft(url);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) void upload(file);
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {value ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`group relative overflow-hidden rounded-xl border bg-gray-50 ${dragOver ? "border-[#042045] ring-2 ring-[#042045]/20" : "border-gray-200"}`}
        >
          <img src={value} alt="Preview" className="h-48 w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow hover:bg-gray-100"
            >
              <UploadCloud className="h-3 w-3" />
              Replace
            </button>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setDraft("");
              }}
              className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-red-700"
            >
              <X className="h-3 w-3" />
              Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          disabled={uploading}
          className={`flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors ${
            dragOver
              ? "border-[#042045] bg-[#042045]/5"
              : "border-gray-200 bg-gray-50 hover:border-gray-300"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <p className="text-xs text-gray-400">Uploading…</p>
            </>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                <ImageIcon className="h-5 w-5 text-gray-500" />
              </div>
              <p className="text-sm font-medium text-gray-600">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-400">JPG, PNG, WEBP or GIF — up to 8MB</p>
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}

      {/* Fallback: paste an external URL (e.g. an Unsplash link) instead of uploading */}
      <details className="group">
        <summary className="cursor-pointer text-xs font-medium text-gray-400 hover:text-gray-600">
          Or paste an image URL instead
        </summary>
        <div className="mt-1.5 flex gap-2">
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
      </details>
    </div>
  );
}
