"use client";

import { useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

// ── Expected JSON shapes ─────────────────────────────────────────────────────

type SchoolJSON = {
  name: string;
  website?: string;
};

type ProfessorJSON = {
  first_name: string;
  last_name: string;
  email?: string;
  bio?: string;
  school_id: number;
};

type CourseJSON = {
  course_code: string;
  name: string;
  description?: string;
  department_id: number;
};

type SeedPayload = {
  schools?: SchoolJSON[];
  professors?: ProfessorJSON[];
  courses?: CourseJSON[];
};

type InsertResult = {
  entity: string;
  inserted: number;
  errors: string[];
};

// ── Component ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [jsonText, setJsonText] = useState("");
  const [results, setResults] = useState<InsertResult[]>([]);
  const [running, setRunning] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setJsonText((ev.target?.result as string) ?? "");
      setParseError(null);
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    setParseError(null);
    setResults([]);

    let payload: SeedPayload;
    try {
      payload = JSON.parse(jsonText);
    } catch {
      setParseError("Invalid JSON — check your file and try again.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setResults([
        {
          entity: "Notice",
          inserted: 0,
          errors: [
            "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to write real data."
          ]
        }
      ]);
      return;
    }

    const client = getSupabaseBrowserClient();
    if (!client) return;

    setRunning(true);
    const allResults: InsertResult[] = [];

    // ── Insert schools ─────────────────────────────────────────────────────
    if (payload.schools?.length) {
      const result: InsertResult = { entity: "Schools", inserted: 0, errors: [] };
      for (const school of payload.schools) {
        const { error } = await client.from("schools").insert({ name: school.name, website: school.website ?? null });
        if (error) {
          result.errors.push(`${school.name}: ${error.message}`);
        } else {
          result.inserted++;
        }
      }
      allResults.push(result);
    }

    // ── Insert professors ──────────────────────────────────────────────────
    if (payload.professors?.length) {
      const result: InsertResult = { entity: "Professors", inserted: 0, errors: [] };
      for (const prof of payload.professors) {
        const { error } = await client.from("professors").insert({
          first_name: prof.first_name,
          last_name: prof.last_name,
          email: prof.email ?? null,
          bio: prof.bio ?? null,
          school_id: prof.school_id
        });
        if (error) {
          result.errors.push(`${prof.first_name} ${prof.last_name}: ${error.message}`);
        } else {
          result.inserted++;
        }
      }
      allResults.push(result);
    }

    // ── Insert courses ─────────────────────────────────────────────────────
    if (payload.courses?.length) {
      const result: InsertResult = { entity: "Courses", inserted: 0, errors: [] };
      for (const course of payload.courses) {
        const { error } = await client.from("courses").insert({
          course_code: course.course_code,
          name: course.name,
          description: course.description ?? null,
          department_id: course.department_id
        });
        if (error) {
          result.errors.push(`${course.course_code}: ${error.message}`);
        } else {
          result.inserted++;
        }
      }
      allResults.push(result);
    }

    setResults(allResults);
    setRunning(false);
  }

  const examplePayload = JSON.stringify(
    {
      schools: [
        { name: "University of Toronto", website: "https://utoronto.ca" },
        { name: "University of British Columbia", website: "https://ubc.ca" }
      ],
      professors: [
        { first_name: "Sarah", last_name: "Chen", email: "s.chen@utoronto.ca", bio: "Algorithms researcher", school_id: 1 }
      ],
      courses: [
        { course_code: "CSC263", name: "Data Structures and Analysis", description: "Trees, graphs, sorting", department_id: 1 }
      ]
    },
    null,
    2
  );

  return (
    <div className="flex min-h-screen flex-col px-4 py-8 md:px-10">
      <header className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-300">
          Admin
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          Seed database
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Upload or paste a JSON file to bulk-insert schools, professors, and courses into Supabase.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Left: input ── */}
        <div className="flex flex-col gap-4">
          {/* File picker */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-400">Upload JSON file</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="block w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-indigo-600 file:px-3 file:py-1 file:text-xs file:font-medium file:text-white"
            />
          </label>

          {/* Or paste */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-400">Or paste JSON below</span>
            <textarea
              className="h-64 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder={examplePayload}
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                setParseError(null);
              }}
            />
          </label>

          {parseError && (
            <p className="rounded-lg border border-red-800 bg-red-950/60 px-3 py-2 text-xs text-red-400">
              {parseError}
            </p>
          )}

          <button
            onClick={handleImport}
            disabled={!jsonText.trim() || running}
            className="self-start rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-indigo-500/30 disabled:opacity-40"
          >
            {running ? "Importing…" : "Import into Supabase"}
          </button>
        </div>

        {/* ── Right: results + schema reference ── */}
        <div className="flex flex-col gap-4">
          {/* Results */}
          {results.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <h2 className="mb-3 text-sm font-semibold text-slate-200">Import results</h2>
              <div className="space-y-3">
                {results.map((r) => (
                  <div key={r.entity}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-300">{r.entity}</span>
                      <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-[10px] text-emerald-400">
                        {r.inserted} inserted
                      </span>
                      {r.errors.length > 0 && (
                        <span className="rounded-full bg-red-900/60 px-2 py-0.5 text-[10px] text-red-400">
                          {r.errors.length} error{r.errors.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    {r.errors.map((err, i) => (
                      <p key={i} className="mt-1 pl-2 text-[11px] text-red-400">
                        • {err}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* JSON shape reference */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Expected JSON shape
            </h2>
            <pre className="overflow-x-auto whitespace-pre text-[11px] leading-relaxed text-slate-400">
{`{
  "schools": [
    { "name": "...", "website": "..." }
  ],
  "professors": [
    {
      "first_name": "...",
      "last_name": "...",
      "email": "...",        // optional
      "bio": "...",          // optional
      "school_id": 1         // FK → schools.id
    }
  ],
  "courses": [
    {
      "course_code": "CSC201",
      "name": "Data Structures",
      "description": "...", // optional
      "department_id": 1    // FK → departments.id
    }
  ]
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
