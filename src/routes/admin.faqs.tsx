import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ChevronDown, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/faqs")({
  component: AdminFaqsPage,
});

type DbFaqItem = { id: number; faqGroupId: number; question: string; answer: string; sortOrder: number };
type DbFaqGroup = { id: number; title: string; sortOrder: number; items: DbFaqItem[] };

const inputCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#042045] focus:bg-white focus:ring-2 focus:ring-[#042045]/10";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

function AdminFaqsPage() {
  const qc = useQueryClient();
  const [openKey, setOpenKey] = useState<number | null>(null);

  // Question modal
  const [qModal, setQModal] = useState<{ mode: "add" | "edit"; groupId: number; itemId?: number } | null>(null);
  const [qForm, setQForm] = useState({ q: "", a: "" });

  // Category modal
  const [catModal, setCatModal] = useState<{ mode: "add" | "edit"; groupId?: number } | null>(null);
  const [catForm, setCatForm] = useState("");

  // Delete states
  const [deleteItem, setDeleteItem] = useState<number | null>(null);
  const [deleteGroup, setDeleteGroup] = useState<number | null>(null);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["faqs"],
    queryFn: () => api.get<DbFaqGroup[]>("/api/faqs"),
  });

  const totalFaqs = groups.reduce((s, g) => s + g.items.length, 0);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["faqs"] });

  // Group mutations
  const addGroupMut = useMutation({
    mutationFn: (title: string) => api.post("/api/faqs", { title }),
    onSuccess: () => { invalidate(); setCatModal(null); },
  });
  const editGroupMut = useMutation({
    mutationFn: ({ id, title }: { id: number; title: string }) => api.patch(`/api/faq-groups/${id}`, { title }),
    onSuccess: () => { invalidate(); setCatModal(null); },
  });
  const deleteGroupMut = useMutation({
    mutationFn: (id: number) => api.delete(`/api/faq-groups/${id}`),
    onSuccess: () => { invalidate(); setDeleteGroup(null); },
  });

  // Item mutations
  const addItemMut = useMutation({
    mutationFn: ({ groupId, q, a }: { groupId: number; q: string; a: string }) =>
      api.post("/api/faq-items", { faqGroupId: groupId, question: q, answer: a }),
    onSuccess: () => { invalidate(); setQModal(null); },
  });
  const editItemMut = useMutation({
    mutationFn: ({ id, q, a }: { id: number; q: string; a: string }) =>
      api.patch(`/api/faq-items/${id}`, { question: q, answer: a }),
    onSuccess: () => { invalidate(); setQModal(null); },
  });
  const deleteItemMut = useMutation({
    mutationFn: (id: number) => api.delete(`/api/faq-items/${id}`),
    onSuccess: () => { invalidate(); setDeleteItem(null); },
  });

  // Handlers
  const openAddQ = (groupId: number) => { setQForm({ q: "", a: "" }); setQModal({ mode: "add", groupId }); };
  const openEditQ = (groupId: number, item: DbFaqItem) => { setQForm({ q: item.question, a: item.answer }); setQModal({ mode: "edit", groupId, itemId: item.id }); };
  const saveQ = () => {
    if (!qModal) return;
    if (qModal.mode === "add") addItemMut.mutate({ groupId: qModal.groupId, q: qForm.q, a: qForm.a });
    else if (qModal.itemId) editItemMut.mutate({ id: qModal.itemId, q: qForm.q, a: qForm.a });
  };

  const openAddCat = () => { setCatForm(""); setCatModal({ mode: "add" }); };
  const openEditCat = (g: DbFaqGroup) => { setCatForm(g.title); setCatModal({ mode: "edit", groupId: g.id }); };
  const saveCat = () => {
    if (!catModal) return;
    if (catModal.mode === "add") addGroupMut.mutate(catForm);
    else if (catModal.groupId) editGroupMut.mutate({ id: catModal.groupId, title: catForm });
  };

  const qSaving = addItemMut.isPending || editItemMut.isPending;
  const catSaving = addGroupMut.isPending || editGroupMut.isPending;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="mt-1 text-sm text-gray-500">{totalFaqs} questions across {groups.length} categories.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openAddCat} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Plus className="h-4 w-4" />Add category
          </button>
          <button onClick={() => groups.length > 0 && openAddQ(groups[0].id)} className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90">
            <Plus className="h-4 w-4" />Add question
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/60 px-6 py-3.5">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-gray-900">{group.title}</h2>
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">{group.items.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEditCat(group)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-white hover:text-gray-600"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => setDeleteGroup(group.id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {group.items.map((item) => {
                  const isOpen = openKey === item.id;
                  return (
                    <div key={item.id}>
                      <button onClick={() => setOpenKey(isOpen ? null : item.id)} className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50/60">
                        <span className="pr-6 text-sm font-medium text-gray-800">{item.question}</span>
                        <div className="flex shrink-0 items-center gap-2">
                          <button onClick={(e) => { e.stopPropagation(); openEditQ(group.id, item); }} className="rounded-lg border border-gray-200 p-1 text-gray-300 hover:bg-white hover:text-gray-600"><Pencil className="h-3 w-3" /></button>
                          <button onClick={(e) => { e.stopPropagation(); setDeleteItem(item.id); }} className="rounded-lg border border-gray-200 p-1 text-gray-300 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
                          <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
                        </div>
                      </button>
                      {isOpen && (
                        <div className="border-t border-gray-100 bg-blue-50/30 px-6 py-4">
                          <p className="text-sm leading-relaxed text-gray-600">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 px-6 py-3">
                <button onClick={() => openAddQ(group.id)} className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-[#042045]">
                  <Plus className="h-3.5 w-3.5" />Add question to "{group.title}"
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Question modal */}
      <Dialog open={qModal !== null} onOpenChange={(o) => !o && setQModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{qModal?.mode === "add" ? "Add question" : "Edit question"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {qModal?.mode === "add" && (
              <div>
                <label className={labelCls}>Category</label>
                <select className={inputCls} value={qModal.groupId} onChange={(e) => setQModal((m) => m ? { ...m, groupId: Number(e.target.value) } : m)}>
                  {groups.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
                </select>
              </div>
            )}
            <div><label className={labelCls}>Question</label><input className={inputCls} value={qForm.q} onChange={(e) => setQForm({ ...qForm, q: e.target.value })} /></div>
            <div><label className={labelCls}>Answer</label><textarea className={inputCls} rows={4} value={qForm.a} onChange={(e) => setQForm({ ...qForm, a: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button onClick={saveQ} disabled={qSaving} className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white hover:bg-[#042045]/90 disabled:opacity-60">
              {qSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category modal */}
      <Dialog open={catModal !== null} onOpenChange={(o) => !o && setCatModal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{catModal?.mode === "add" ? "Add category" : "Rename category"}</DialogTitle></DialogHeader>
          <div className="py-2"><label className={labelCls}>Category name</label><input className={inputCls} value={catForm} onChange={(e) => setCatForm(e.target.value)} /></div>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button onClick={saveCat} disabled={catSaving} className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white hover:bg-[#042045]/90 disabled:opacity-60">
              {catSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete question modal */}
      <Dialog open={deleteItem !== null} onOpenChange={(o) => !o && setDeleteItem(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete question?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">This FAQ entry will be removed.</p>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button onClick={() => deleteItem !== null && deleteItemMut.mutate(deleteItem)} disabled={deleteItemMut.isPending} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
              {deleteItemMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete group modal */}
      <Dialog open={deleteGroup !== null} onOpenChange={(o) => !o && setDeleteGroup(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete category?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">This will delete the category and all its questions.</p>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button onClick={() => deleteGroup !== null && deleteGroupMut.mutate(deleteGroup)} disabled={deleteGroupMut.isPending} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
              {deleteGroupMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
