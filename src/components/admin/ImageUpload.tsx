import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
};

export function ImageUpload({ value, onChange, label = "Image" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFiles = (files: FileList | null) => {
    if (files?.[0]) processFile(files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {value ? (
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          <img
            src={value}
            alt="Preview"
            className="h-48 w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow hover:bg-gray-50"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragging(false)}
          className={cn(
            "flex h-40 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors",
            dragging
              ? "border-[#042045] bg-[#042045]/5"
              : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
          )}
        >
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", dragging ? "bg-[#042045]/10" : "bg-gray-200")}>
            {dragging ? (
              <ImageIcon className="h-5 w-5 text-[#042045]" />
            ) : (
              <Upload className="h-5 w-5 text-gray-500" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              {dragging ? "Drop to upload" : "Click or drag to upload"}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">PNG, JPG, WEBP — max 10 MB</p>
          </div>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
