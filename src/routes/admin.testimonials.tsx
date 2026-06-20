import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { reviews, aggregate } from "@/data/reviews";

export const Route = createFileRoute("/admin/testimonials")({
  component: AdminTestimonialsPage,
});

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`h-3.5 w-3.5 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

function AdminTestimonialsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="mt-1 text-sm text-gray-500">
            {reviews.length} reviews · Average{" "}
            <span className="font-semibold text-amber-600">{aggregate.average} / 5</span>
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#042045] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#042045]/90">
          <Plus className="h-4 w-4" />
          Add testimonial
        </button>
      </div>

      {/* Aggregate card */}
      <div className="mb-6 flex items-center gap-6 rounded-xl border border-amber-100 bg-amber-50 px-6 py-4">
        <div className="text-center">
          <p className="text-4xl font-bold text-amber-600">{aggregate.average}</p>
          <StarRating rating={Math.round(aggregate.average)} />
          <p className="mt-1 text-xs text-amber-700">{aggregate.count} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const pct = Math.round((count / reviews.length) * 100);
            return (
              <div key={star} className="flex items-center gap-2 text-xs text-amber-800">
                <span className="w-4 text-right">{star}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-amber-200">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reviews.map((r) => (
          <div key={r.id} className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">{r.author}</p>
                <p className="text-xs text-gray-400">{r.trip}</p>
              </div>
              <StarRating rating={r.rating} />
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">"{r.body}"</p>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs text-gray-400">
                {new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              <div className="flex items-center gap-1.5">
                <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
