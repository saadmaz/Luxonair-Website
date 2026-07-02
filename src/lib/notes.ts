export const NOTE_TYPES = ["note", "call", "follow_up", "email"] as const;

export type NoteType = (typeof NOTE_TYPES)[number];

export const NOTE_TYPE_LABELS: Record<NoteType, string> = {
  note: "Note",
  call: "Call",
  follow_up: "Follow-up",
  email: "Email",
};

export type NoteEntry = {
  id: number;
  body: string;
  type: NoteType;
  authorEmail: string;
  authorName: string | null;
  createdAt: string;
};
