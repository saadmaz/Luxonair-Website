import { useState } from "react";
import { Loader2, Phone, Mail, StickyNote, RefreshCw } from "lucide-react";
import { NOTE_TYPES, NOTE_TYPE_LABELS, type NoteEntry, type NoteType } from "@/lib/notes";

const NOTE_TYPE_ICONS: Record<NoteType, typeof Phone> = {
  note: StickyNote,
  call: Phone,
  follow_up: RefreshCw,
  email: Mail,
};

const NOTE_TYPE_BADGE: Record<NoteType, string> = {
  note: "bg-gray-100 text-gray-600",
  call: "bg-blue-50 text-blue-700",
  follow_up: "bg-amber-50 text-amber-700",
  email: "bg-purple-50 text-purple-700",
};

const inputCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#042045] focus:bg-white focus:ring-2 focus:ring-[#042045]/10";

// Append-only CRM-style activity log — used on both the enquiries and
// messages admin pages so calls/follow-ups/notes are tracked the same way.
export function NotesLog({
  notes,
  onAdd,
  isPending,
  emptyLabel = "No activity logged yet",
}: {
  notes: NoteEntry[];
  onAdd: (body: string, type: NoteType) => void;
  isPending: boolean;
  emptyLabel?: string;
}) {
  const [body, setBody] = useState("");
  const [type, setType] = useState<NoteType>("note");

  const submit = () => {
    if (!body.trim()) return;
    onAdd(body.trim(), type);
    setBody("");
  };

  return (
    <div>
      <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
        {notes.length === 0 ? (
          <p className="text-sm text-gray-400">{emptyLabel}</p>
        ) : (
          notes.map((n) => {
            const Icon = NOTE_TYPE_ICONS[n.type];
            return (
              <div key={n.id} className="rounded-lg border border-gray-200 bg-white p-2.5">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${NOTE_TYPE_BADGE[n.type]}`}>
                      <Icon className="h-3 w-3" />{NOTE_TYPE_LABELS[n.type]}
                    </span>
                    <p className="text-xs font-semibold text-gray-700">{n.authorName || n.authorEmail}</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleString("en-GB", {
                      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">{n.body}</p>
              </div>
            );
          })
        )}
      </div>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <select
          className={`${inputCls} sm:w-40 sm:shrink-0`}
          value={type}
          onChange={(e) => setType(e.target.value as NoteType)}
        >
          {NOTE_TYPES.map((t) => (
            <option key={t} value={t}>{NOTE_TYPE_LABELS[t]}</option>
          ))}
        </select>
        <textarea
          className={inputCls}
          rows={2}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Log a call, follow-up, or note…"
        />
      </div>
      <button
        onClick={submit}
        disabled={isPending || !body.trim()}
        className="mt-2 inline-flex items-center gap-2 self-start rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
      >
        {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Add entry
      </button>
    </div>
  );
}
