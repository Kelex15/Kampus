"use client";

import { useState, useRef } from "react";
import {
  Upload,
  CheckCircle,
  XCircle,
  FileJson,
  GraduationCap,
  BookOpen,
  Users,
  Loader2,
  X,
  AlertTriangle,
  Building2,
  Layers,
  Trash2,
  RefreshCw,
} from "lucide-react";
import PageShell from "@/components/shared/PageShell";
import { importSchools, importFaculties, importDepartments, importProfessors, importCourses, updateCourseDescriptions, clearAllData, seedAll } from "./actions";

// ── Result type ───────────────────────────────────────────────────────────────

type InsertResult = {
  label: string;
  inserted: number;
  warnings: string[];
  errors: string[];
};

// ── Config per type ───────────────────────────────────────────────────────────

type DataType = "schools" | "faculties" | "departments" | "professors" | "courses" | "descriptions";

const TYPE_CONFIG: Record<DataType, { label: string; icon: React.ElementType; schema: string }> = {
  schools: {
    label: "Schools",
    icon: GraduationCap,
    schema: `[
  {
    "name": "St. Thomas University",
    "websiteUrl": "https://www.stu.ca/"  // optional
  }
]`,
  },
  faculties: {
    label: "Faculties",
    icon: Building2,
    schema: `[
  {
    "name": "Faculty of Computer Science",
    "universityId": "stu"  // matched to school via website URL
  }
]`,
  },
  departments: {
    label: "Departments",
    icon: Layers,
    schema: `[
  {
    "name": "Computer Science",
    "faculty": "Faculty of Computer Science"  // matched by name
    // or: "facultyName": "..."
  }
]`,
  },
  professors: {
    label: "Professors",
    icon: Users,
    schema: `[
  {
    "universityId": "stu",   // matched to school via website URL
    "name": "Sheila Andrew"  // split into first + last name automatically
  }
]`,
  },
  courses: {
    label: "Courses",
    icon: BookOpen,
    schema: `[
  {
    "code": "COMP1631",       // → course_code
    "title": "Intro to CS",   // → name
    "department": "CS"        // matched by name or abbreviation (CS → Computer Science)
  }
]`,
  },
  descriptions: {
    label: "Descriptions",
    icon: FileJson,
    schema: `[
  {
    "code": "CS1073",
    "description": "Introduction to Computer Programming I — variables, control flow, functions, and basic data structures in Python."
  }
]`,
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [dataType, setDataType] = useState<DataType>("schools");
  const [jsonText, setJsonText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [result, setResult] = useState<InsertResult | null>(null);
  const [running, setRunning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [dangerRunning, setDangerRunning] = useState(false);
  const [dangerResult, setDangerResult] = useState<InsertResult | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmSeed, setConfirmSeed] = useState(false);

  const config = TYPE_CONFIG[dataType];

  function handleTypeChange(t: DataType) {
    setDataType(t);
    setJsonText("");
    setFileName(null);
    setParseError(null);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setParseError(null);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => setJsonText((ev.target?.result as string) ?? "");
    reader.readAsText(file);
  }

  function clearFile() {
    setJsonText("");
    setFileName(null);
    setParseError(null);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleImport() {
    setParseError(null);
    setResult(null);

    let rows: unknown[];
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) throw new Error("JSON must be an array [ … ]");
      rows = parsed;
    } catch (err: any) {
      setParseError(err.message ?? "Invalid JSON");
      return;
    }

    setRunning(true);
    try {
      let res;
      if (dataType === "schools") res = await importSchools(rows);
      else if (dataType === "faculties") res = await importFaculties(rows);
      else if (dataType === "departments") res = await importDepartments(rows);
      else if (dataType === "professors") res = await importProfessors(rows);
      else if (dataType === "courses") res = await importCourses(rows);
      else res = await updateCourseDescriptions(rows);
      setResult(res);
    } catch (err: any) {
      setResult({ label: config.label, inserted: 0, warnings: [], errors: [err?.message ?? String(err)] });
    } finally {
      setRunning(false);
    }
  }

  const canImport = jsonText.trim().length > 0 && !running;
  const hasIssues = (result?.errors.length ?? 0) > 0;
  const hasWarnings = (result?.warnings.length ?? 0) > 0;

  return (
    <PageShell>
      <main className="min-h-screen pt-16 lg:pt-20">
        {/* Header */}
        <section className="relative overflow-hidden bg-green-50 border-b-[3px] border-gray-900">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.15]"
            style={{ backgroundImage: "radial-gradient(circle, #9ca3af 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-gray-900 rounded-full text-xs font-black text-gray-900 uppercase tracking-widest mb-4 shadow-[2px_2px_0px_#16a34a]">
              Admin
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              Seed Database
            </h1>
            <p className="text-base sm:text-lg text-gray-500 font-bold mt-3 max-w-xl">
              Upload a JSON array to bulk-insert data. Import schools first — professors and courses resolve school/department IDs automatically.
            </p>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">

            {/* Type selector */}
            <div className="bg-white border-2 border-gray-900 rounded-xl p-5 sm:p-6 shadow-[5px_5px_0px_#16a34a]">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                1 — Select data type
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {(Object.keys(TYPE_CONFIG) as DataType[]).map((t) => {
                  const Icon = TYPE_CONFIG[t].icon;
                  const active = dataType === t;
                  return (
                    <button
                      key={t}
                      onClick={() => handleTypeChange(t)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-all ${
                        active
                          ? "border-gray-900 bg-gray-900 text-white shadow-[3px_3px_0px_#16a34a]"
                          : "border-gray-200 bg-white text-gray-500 hover:border-gray-900 hover:text-gray-900"
                      }`}
                    >
                      <Icon size={20} className={active ? "text-green-400" : "text-gray-400"} />
                      {TYPE_CONFIG[t].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* File upload */}
            <div className="bg-white border-2 border-gray-900 rounded-xl p-5 sm:p-6 shadow-[5px_5px_0px_#16a34a]">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                2 — Upload or paste JSON
              </h2>

              {!fileName ? (
                <label className="flex flex-col items-center justify-center gap-3 w-full h-36 border-2 border-dashed border-gray-300 hover:border-green-600 rounded-xl cursor-pointer transition-colors group bg-gray-50 hover:bg-green-50">
                  <div className="w-12 h-12 bg-white border-2 border-gray-200 group-hover:border-green-600 rounded-xl flex items-center justify-center transition-all">
                    <Upload size={20} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-600 group-hover:text-gray-900">
                      Click to upload <span className="text-green-600">.json</span> file
                    </p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      Must be a JSON array of {TYPE_CONFIG[dataType].label.toLowerCase()}
                    </p>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border-2 border-green-600 rounded-xl">
                  <FileJson size={20} className="text-green-600 flex-shrink-0" />
                  <span className="text-sm font-bold text-gray-900 flex-1 truncate">{fileName}</span>
                  <button onClick={clearFile} className="p-1 hover:bg-green-100 rounded-lg transition-colors">
                    <X size={14} className="text-gray-500" />
                  </button>
                </div>
              )}

              <div className="mt-4">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Or paste JSON here
                </label>
                <textarea
                  className="h-48 w-full rounded-xl border-2 border-gray-200 focus:border-green-600 bg-gray-50 px-4 py-3 font-mono text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white transition-all resize-none"
                  placeholder={`[\n  { ... }\n]`}
                  value={jsonText}
                  onChange={(e) => {
                    setJsonText(e.target.value);
                    setFileName(null);
                    setParseError(null);
                    setResult(null);
                  }}
                />
              </div>

              {parseError && (
                <div className="mt-3 flex items-start gap-2 px-4 py-3 bg-red-50 border-2 border-red-300 rounded-xl">
                  <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-bold text-red-700">{parseError}</p>
                </div>
              )}

              <button
                onClick={handleImport}
                disabled={!canImport}
                className="mt-4 inline-flex items-center gap-2.5 px-6 py-3 bg-green-600 text-white font-bold rounded-xl border-2 border-green-600 hover:bg-green-700 hover:border-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[3px_3px_0px_#111827] hover:shadow-[4px_4px_0px_#111827] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-0 active:translate-y-0"
              >
                {running ? (
                  <><Loader2 size={16} className="animate-spin" />Importing…</>
                ) : (
                  <><Upload size={16} />Import {config.label}</>
                )}
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className={`border-2 rounded-xl p-5 sm:p-6 ${
                hasIssues
                  ? "border-red-300 bg-red-50 shadow-[5px_5px_0px_#fca5a5]"
                  : "border-green-600 bg-green-50 shadow-[5px_5px_0px_#16a34a]"
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  {hasIssues
                    ? <XCircle size={20} className="text-red-500" />
                    : <CheckCircle size={20} className="text-green-600" />
                  }
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                    Results — {result.label}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-green-600 rounded-lg">
                    <span className="text-xs font-black text-gray-500 uppercase">Inserted</span>
                    <span className="text-lg font-black text-green-600">{result.inserted}</span>
                  </div>
                  {hasWarnings && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-amber-400 rounded-lg">
                      <span className="text-xs font-black text-gray-500 uppercase">Warnings</span>
                      <span className="text-lg font-black text-amber-500">{result.warnings.length}</span>
                    </div>
                  )}
                  {hasIssues && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-red-300 rounded-lg">
                      <span className="text-xs font-black text-gray-500 uppercase">Errors</span>
                      <span className="text-lg font-black text-red-500">{result.errors.length}</span>
                    </div>
                  )}
                </div>

                {hasWarnings && (
                  <div className="mb-3 space-y-1.5">
                    {result.warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-amber-700 font-medium">
                        <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        {w}
                      </div>
                    ))}
                  </div>
                )}

                {hasIssues && (
                  <div className="space-y-1.5">
                    {result.errors.map((e, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-red-700 font-medium">
                        <span className="text-red-400 mt-0.5">•</span>
                        {e}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Schema reference */}
            <div className="bg-white border-2 border-gray-900 rounded-xl p-5 sm:p-6 shadow-[5px_5px_0px_#16a34a]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
                  <FileJson size={12} className="text-white" />
                </div>
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Expected format — {config.label}
                </h2>
              </div>
              <pre className="overflow-x-auto bg-gray-900 text-green-400 font-mono text-xs leading-relaxed rounded-xl p-4 border-2 border-gray-900">
                {config.schema}
              </pre>
            </div>

            {/* Danger zone */}
            <div className="border-2 border-red-300 rounded-xl p-5 sm:p-6 bg-red-50">
              <h2 className="text-xs font-black text-red-500 uppercase tracking-widest mb-1">
                Danger Zone
              </h2>
              <p className="text-sm text-red-700 font-medium mb-5">
                These actions are irreversible. User accounts are preserved — delete them manually via the Supabase dashboard if needed.
              </p>

              <div className="flex flex-wrap gap-3">
                {/* Clear all */}
                {!confirmClear ? (
                  <button
                    onClick={() => setConfirmClear(true)}
                    disabled={dangerRunning}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white text-red-600 font-bold text-sm rounded-xl border-2 border-red-300 hover:border-red-500 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <Trash2 size={15} />
                    Clear all tables + storage
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      setConfirmClear(false);
                      setDangerRunning(true);
                      setDangerResult(null);
                      try {
                        const res = await clearAllData();
                        setDangerResult(res);
                      } catch (e: any) {
                        setDangerResult({ label: "Reset", inserted: 0, warnings: [], errors: [e?.message ?? String(e)] });
                      } finally {
                        setDangerRunning(false);
                      }
                    }}
                    disabled={dangerRunning}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 text-white font-bold text-sm rounded-xl border-2 border-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[3px_3px_0px_#111827]"
                  >
                    <Trash2 size={15} />
                    Confirm — delete everything
                  </button>
                )}

                {/* Seed all */}
                {!confirmSeed ? (
                  <button
                    onClick={() => setConfirmSeed(true)}
                    disabled={dangerRunning}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-700 font-bold text-sm rounded-xl border-2 border-gray-300 hover:border-gray-900 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <RefreshCw size={15} />
                    Seed with default data
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      setConfirmSeed(false);
                      setDangerRunning(true);
                      setDangerResult(null);
                      try {
                        const results = await seedAll();
                        const combined: InsertResult = {
                          label: "Seed",
                          inserted: results.reduce((s, r) => s + r.inserted, 0),
                          warnings: results.flatMap((r) => r.warnings.map((w) => `[${r.label}] ${w}`)),
                          errors: results.flatMap((r) => r.errors.map((e) => `[${r.label}] ${e}`)),
                        };
                        setDangerResult(combined);
                      } catch (e: any) {
                        setDangerResult({ label: "Seed", inserted: 0, warnings: [], errors: [e?.message ?? String(e)] });
                      } finally {
                        setDangerRunning(false);
                      }
                    }}
                    disabled={dangerRunning}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white font-bold text-sm rounded-xl border-2 border-gray-900 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[3px_3px_0px_#16a34a]"
                  >
                    <RefreshCw size={15} />
                    Confirm — seed default data
                  </button>
                )}

                {dangerRunning && (
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                    <Loader2 size={15} className="animate-spin" />
                    Running…
                  </div>
                )}
              </div>

              {dangerResult && (
                <div className={`mt-4 p-4 rounded-xl border-2 text-sm font-medium ${dangerResult.errors.length > 0 ? "border-red-300 bg-white text-red-700" : "border-green-600 bg-white text-green-700"}`}>
                  <p className="font-black mb-2">{dangerResult.label} — {dangerResult.inserted} row(s) inserted</p>
                  {dangerResult.warnings.map((w, i) => (
                    <p key={i} className="text-gray-500 text-xs">{w}</p>
                  ))}
                  {dangerResult.errors.map((e, i) => (
                    <p key={i} className="text-red-600 text-xs">{e}</p>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>
      </main>
    </PageShell>
  );
}
