"use client";

import { useMemo, useState } from "react";
import { useProfessors, type Review } from "@/hooks/use-professors";
import { submitReviewAction } from "./actions";
import { useAuth } from "@/hooks/use-auth";

export default function ProfessorsPage() {
  const { professors, reviews, setReviews, loading } = useProfessors();
  const { user } = useAuth();
  const [professorId, setProfessorId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const computed = useMemo(() => {
    return professors.map((p) => {
      const reps = reviews.filter((r) => r.professor_id === p.id);
      if (!reps.length) {
        return { professor: p, avg: null as number | null, count: 0, lastTwo: [] as Review[] };
      }
      const avg = reps.reduce((sum, r) => sum + r.rating, 0) / reps.length;
      return { professor: p, avg, count: reps.length, lastTwo: reps.slice(-2) };
    });
  }, [professors, reviews]);

  async function handleSubmit() {
    setError("");
    if (!professorId) { setError("Choose a professor."); return; }
    if (rating < 1 || rating > 5) { setError("Rating must be between 1 and 5."); return; }
    if (!comment.trim()) { setError("Add a short comment."); return; }

    setSubmitting(true);
    const { data, error: submitError } = await submitReviewAction(
      professorId,
      rating,
      comment.trim(),
      user?.id ?? null
    );
    setSubmitting(false);

    if (submitError || !data) {
      setError(submitError ?? "Failed to submit review.");
      return;
    }

    setReviews((prev) => [...prev, data]);
    setComment("");
    setRating(5);
    setProfessorId(null);
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 px-4 py-8 md:px-8 md:flex-row">
      <section className="flex-1 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <header className="mb-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-300">
            Professors
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-slate-50 md:text-2xl">
            Reputation that travels with you
          </h1>
        </header>

        <div className="space-y-2 text-sm">
          {loading && (
            <p className="text-xs text-slate-500">Loading professors and reviews…</p>
          )}
          {!loading && computed.map(({ professor, avg, count, lastTwo }) => (
            <article
              key={professor.id}
              className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium text-slate-100">
                  {professor.first_name} {professor.last_name}
                </div>
                <div className="text-[11px] text-amber-300">
                  {avg !== null ? (
                    <>{"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))}</>
                  ) : "☆☆☆☆☆"}
                </div>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                {avg !== null
                  ? `${avg.toFixed(1)}/5 from ${count} review${count === 1 ? "" : "s"}`
                  : "No reviews yet — be the first."}
              </p>
              {lastTwo.length > 0 && (
                <div className="mt-2 space-y-1">
                  {lastTwo.map((r) => (
                    <div key={r.id} className="flex items-start gap-2 text-[11px] text-slate-200">
                      <span className="mt-[2px] rounded-full bg-amber-300 px-1.5 py-[1px] text-[10px] text-slate-950">
                        ★{r.rating}
                      </span>
                      <span>{r.comment}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
          {!loading && professors.length === 0 && (
            <p className="text-xs text-slate-500">No professors found.</p>
          )}
        </div>
      </section>

      <section className="w-full max-w-sm space-y-3 rounded-2xl border border-slate-800 bg-slate-950/90 p-4 text-sm text-slate-200">
        <header className="space-y-1">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            Leave a review
          </div>
        </header>
        <div className="space-y-2">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300" htmlFor="prof">Professor</label>
            <select
              id="prof"
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100"
              value={professorId ?? ""}
              onChange={(e) => setProfessorId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Choose a professor</option>
              {professors.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300" htmlFor="rating">Rating</label>
              <input
                id="rating"
                type="number"
                min={1}
                max={5}
                className="w-20 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
            </div>
            <span className="rounded-full border border-slate-700 bg-slate-900/80 px-2 py-1 text-[10px] text-slate-300">
              1–5, where 5 is great
            </span>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300" htmlFor="comment">Review</label>
            <textarea
              id="comment"
              className="h-24 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100"
              placeholder="e.g. Very clear slides, tough exams but transparent grading."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-[11px] text-rose-400">{error}</p>}
        <button
          className="mt-1 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 px-4 py-1.5 text-xs font-medium text-slate-950 shadow-lg shadow-indigo-500/40 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Submit review"}
        </button>
      </section>
    </div>
  );
}
