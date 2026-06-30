import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Clock, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { api } from "@/lib/api";
import { Pagination } from "@/components/ui/Pagination";

export const Route = createFileRoute("/admin/blog")({
  component: AdminBlogPage,
});

type DbPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readMinutes: number;
  heroImage: string;
};

const inputCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#042045] focus:bg-white focus:ring-2 focus:ring-[#042045]/10";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

const categories = ["Guides", "Corporate", "Family", "Destinations", "News"];
const categoryColors: Record<string, string> = {
  Guides: "bg-blue-50 text-blue-700", Corporate: "bg-violet-50 text-violet-700",
  Family: "bg-amber-50 text-amber-700", Destinations: "bg-emerald-50 text-emerald-700", News: "bg-gray-100 text-gray-600",
};

const emptyForm = { slug: "", title: "", excerpt: "", category: "Guides", author: "Luxeonair Editorial", date: new Date().toISOString().slice(0, 10), readMinutes: 5, heroImage: "" };

function AdminBlogPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const { data: result, isLoading } = useQuery({
    queryKey: ["blog", page],
    queryFn: () => api.getPaged<DbPost>("/api/blog", page),
  });
  const posts = result?.data ?? [];
  const total = result?.total ?? 0;

  const saveMut = useMutation({
    mutationFn: (data: typeof emptyForm) =>
      editId !== null
        ? api.patch(`/api/blog/${editId}`, data)
        : api.post("/api/blog", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["blog"] }); setModal(null); },
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/api/blog/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["blog"] }); setDeleteId(null); },
  });

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModal("add"); };
  const openEdit = (post: DbPost) => {
    setEditId(post.id);
    setForm({ slug: post.slug, title: post.title, excerpt: post.excerpt, category: post.category, author: post.author, date: post.date, readMinutes: post.readMinutes, heroImage: post.heroImage });
    setModal("edit");
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="mt-1 text-sm text-gray-500">{posts.length} posts published.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90">
          <Plus className="h-4 w-4" />New post
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {["Post", "Category", "Author", "Date", "Read time", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 first:pl-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="transition-colors hover:bg-gray-50/60">
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {post.heroImage && <img src={post.heroImage} alt={post.title} className="h-full w-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 leading-snug line-clamp-2 max-w-xs">{post.title}</p>
                          <p className="mt-0.5 text-xs text-gray-400 line-clamp-1 max-w-xs">{post.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[post.category] ?? "bg-gray-100 text-gray-600"}`}>{post.category}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{post.author}</td>
                    <td className="px-4 py-4 text-gray-500">{new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-gray-400"><Clock className="h-3.5 w-3.5" /><span className="text-xs">{post.readMinutes} min</span></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(post)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setDeleteId(post.id)} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-gray-100 md:hidden">
            {posts.map((post) => (
              <div key={post.id} className="flex gap-3 px-5 py-4">
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {post.heroImage && <img src={post.heroImage} alt={post.title} className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{post.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${categoryColors[post.category] ?? "bg-gray-100 text-gray-600"}`}>{post.category}</span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-0.5"><Clock className="h-3 w-3" />{post.readMinutes}m</span>
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    <button onClick={() => openEdit(post)} className="rounded-lg border border-gray-200 p-1 text-gray-400 hover:bg-gray-50"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setDeleteId(post.id)} className="rounded-lg border border-gray-200 p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        <Pagination page={page} total={total} limit={50} onChange={setPage} />
        </div>
      )}

      {/* Add / Edit modal */}
      <Dialog open={modal !== null} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{modal === "add" ? "New post" : "Edit post"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><label className={labelCls}>Slug</label><input className={inputCls} placeholder="e.g. best-maldives-resorts" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            <div><label className={labelCls}>Title</label><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><label className={labelCls}>Excerpt</label><textarea className={inputCls} rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Category</label>
                <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Author</label><input className={inputCls} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
              <div><label className={labelCls}>Publish date</label><input type="date" className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div><label className={labelCls}>Read time (min)</label><input type="number" className={inputCls} value={form.readMinutes} onChange={(e) => setForm({ ...form, readMinutes: +e.target.value })} /></div>
            </div>
            <ImageUpload label="Hero image" value={form.heroImage} onChange={(url) => setForm({ ...form, heroImage: url })} />
          </div>
          {saveMut.error && <p className="text-sm text-red-600">{(saveMut.error as Error).message}</p>}
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button onClick={() => saveMut.mutate(form)} disabled={saveMut.isPending} className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white hover:bg-[#042045]/90 disabled:opacity-60">
              {saveMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete modal */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete post?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">This post will be permanently removed from the blog.</p>
          <DialogFooter>
            <DialogClose asChild><button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></DialogClose>
            <button onClick={() => deleteId !== null && deleteMut.mutate(deleteId)} disabled={deleteMut.isPending} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
              {deleteMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
