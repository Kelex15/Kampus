"use client";

import { useState } from "react";

type Resource = {
  id: number;
  title: string;
  url: string;
  type: string;
};

const INITIAL_RESOURCES: Resource[] = [
  {
    id: 1,
    title: "Notion summary – Weeks 1–4",
    url: "https://notion.so/example",
    type: "Notes"
  },
  {
    id: 2,
    title: "YouTube playlist – Data Structures",
    url: "https://youtube.com/example",
    type: "Video"
  }
];

export default function RoomResourcesPage() {
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  function handleAdd() {
    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();
    if (!trimmedTitle || !trimmedUrl) return;
    setResources((prev) => [
      ...prev,
      { id: Date.now(), title: trimmedTitle, url: trimmedUrl, type: "Link" }
    ]);
    setTitle("");
    setUrl("");
  }

  return (
    <div className="flex min-h-screen flex-col px-4 py-8 md:px-8">
      <header className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-300">
          Course room
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          Shared resources
        </h1>
        <p className="text-sm text-slate-400">
          One place for links, notes and past questions – attached to the course instead of buried
          in chats.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-[1.3fr,1fr]">
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs text-slate-400">
            <span>Resources live only in this browser session for now.</span>
            <span className="rounded-full border border-slate-700 bg-slate-900/80 px-2 py-0.5 text-[10px]">
              Fake data · Real UX
            </span>
          </div>
          <div className="space-y-2 text-sm">
            {resources.length === 0 && (
              <p className="text-xs text-slate-500">
                No resources yet – add the first summary, Notion doc or YouTube playlist.
              </p>
            )}
            {resources.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-xs"
              >
                <div>
                  <div className="font-medium text-slate-100">{r.title}</div>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-sky-300 hover:underline"
                  >
                    {r.url}
                  </a>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-950 px-2 py-0.5 text-[10px] text-slate-300">
                  {r.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/90 p-4 text-sm text-slate-200">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Add resource
            </div>
            <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2 py-0.5 text-[10px] text-slate-300">
              1–2 fields · seconds to add
            </span>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                placeholder="e.g. Past questions – 2024"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300" htmlFor="url">
                Link
              </label>
              <input
                id="url"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                placeholder="https://link-to-resource"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
          <button
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 px-4 py-1.5 text-xs font-medium text-slate-950 shadow-lg shadow-indigo-500/40"
            onClick={handleAdd}
          >
            Add resource
          </button>
          <p className="text-[11px] text-slate-500">
            In a real build this would write to Supabase `resources` tied to `rooms` and
            `courses`.
          </p>
        </div>
      </section>
    </div>
  );
}

