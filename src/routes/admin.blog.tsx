import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import { blogPosts } from "@/data/blog";

export const Route = createFileRoute("/admin/blog")({
  component: AdminBlogPage,
});

const categoryColors: Record<string, string> = {
  Guides: "bg-blue-50 text-blue-700",
  Corporate: "bg-violet-50 text-violet-700",
  Destinations: "bg-emerald-50 text-emerald-700",
  Family: "bg-amber-50 text-amber-700",
};

function AdminBlogPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="mt-1 text-sm text-gray-500">{blogPosts.length} posts published.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90">
          <Plus className="h-4 w-4" />
          New post
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Post", "Category", "Author", "Date", "Read time", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 first:pl-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogPosts.map((post) => (
                <tr key={post.slug} className="transition-colors hover:bg-gray-50/60">
                  <td className="py-4 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img src={post.heroImage} alt={post.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 leading-snug line-clamp-2 max-w-xs">{post.title}</p>
                        <p className="mt-0.5 text-xs text-gray-400 line-clamp-1 max-w-xs">{post.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[post.category] ?? "bg-gray-100 text-gray-600"}`}>
                      {post.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{post.author}</td>
                  <td className="px-4 py-4 text-gray-500">
                    {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs">{post.readMinutes} min</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y divide-gray-100 md:hidden">
          {blogPosts.map((post) => (
            <div key={post.slug} className="flex gap-3 px-5 py-4">
              <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <img src={post.heroImage} alt={post.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{post.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${categoryColors[post.category] ?? "bg-gray-100 text-gray-600"}`}>
                    {post.category}
                  </span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                    <Clock className="h-3 w-3" />{post.readMinutes}m
                  </span>
                </div>
                <div className="mt-2 flex gap-1.5">
                  <button className="rounded-lg border border-gray-200 p-1 text-gray-400 hover:bg-gray-50"><Pencil className="h-3.5 w-3.5" /></button>
                  <button className="rounded-lg border border-gray-200 p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
