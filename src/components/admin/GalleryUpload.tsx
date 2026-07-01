import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImageIcon, Loader2, X } from "lucide-react";

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 8 * 1024 * 1024;

export function GalleryUpload({ value, onChange, label = "Gallery images" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      onChange([...value, url]);
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

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
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

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((url, i) => (
            <div key={`${url}-${i}`} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <img src={url} alt={`Gallery ${i + 1}`} className="aspect-square w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded-md bg-white p-1 text-gray-700 shadow disabled:opacity-40"
                >
                  <ArrowLeft className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded-md bg-red-600 p-1 text-white shadow"
                >
                  <X className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  className="rounded-md bg-white p-1 text-gray-700 shadow disabled:opacity-40"
                >
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
        className={`flex h-20 w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed transition-colors ${
          dragOver ? "border-[#042045] bg-[#042045]/5" : "border-gray-200 bg-gray-50 hover:border-gray-300"
        }`}
      >
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        ) : (
          <>
            <ImageIcon className="h-4 w-4 text-gray-400" />
            <p className="text-xs font-medium text-gray-500">Add image — click or drag & drop</p>
          </>
        )}
      </button>

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
