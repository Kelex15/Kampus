"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type InsertResult = { label: string; inserted: number; warnings: string[]; errors: string[] };

function getAdminClient() {
  return createSupabaseServerClient();
}

function splitName(full: string): { first_name: string; last_name: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { first_name: parts[0], last_name: "" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

/** Build a slug → school_id map from website URLs (e.g. "https://www.stu.ca/" → "stu"). */
function buildSchoolMap(schools: { id: number; website: string | null }[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const s of schools) {
    if (s.website) {
      const match = s.website.match(/\/\/(?:www\.)?([^./]+)/);
      if (match) map[match[1].toLowerCase()] = s.id;
    }
  }
  return map;
}

/**
 * Match a hint like "CS" against a map of department names like "computer science".
 * Tries: exact key → substring → abbreviation (first letters of each word).
 */
function matchDept(hint: string, deptMap: Record<string, number>): number | null {
  const h = hint.toLowerCase();
  if (deptMap[h]) return deptMap[h];

  // Substring match ("computer science" contains "cs"? No — but "cs" contained in "computer science"? No)
  const substringMatch = Object.entries(deptMap).find(([k]) => k.includes(h) || h.includes(k));
  if (substringMatch) return substringMatch[1];

  // Abbreviation match: "CS" → first letter of each word in dept name
  const abbrev = (name: string) => name.split(/\s+/).map(w => w[0]).join("").toLowerCase();
  const abbrMatch = Object.entries(deptMap).find(([k]) => abbrev(k) === h);
  if (abbrMatch) return abbrMatch[1];

  return null;
}

// ── Schools ───────────────────────────────────────────────────────────────────

export async function importSchools(rows: unknown[]): Promise<InsertResult> {
  const res: InsertResult = { label: "Schools", inserted: 0, warnings: [], errors: [] };
  const client = getAdminClient();

  const toInsert: { name: string; website: string | null }[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") { res.errors.push("Skipped non-object entry"); continue; }
    const s = row as Record<string, unknown>;
    const name = (s.name as string | undefined)?.trim();
    if (!name) { res.errors.push("Row missing required field: name"); continue; }
    toInsert.push({ name, website: (s.websiteUrl ?? s.website ?? null) as string | null });
  }

  if (toInsert.length === 0) return res;

  for (const row of toInsert) {
    const { error } = await client.from("schools").insert(row);
    if (!error) {
      res.inserted++;
    } else if (error.code === "23505") {
      res.warnings.push(`"${row.name}" already exists — skipped`);
    } else {
      res.errors.push(`"${row.name}": ${error.message}`);
    }
  }
  return res;
}

// ── Faculties ─────────────────────────────────────────────────────────────────

export async function importFaculties(rows: unknown[]): Promise<InsertResult> {
  const res: InsertResult = { label: "Faculties", inserted: 0, warnings: [], errors: [] };
  const client = getAdminClient();

  const { data: allSchools } = await client.from("schools").select("id, website");
  const schoolMap = buildSchoolMap(allSchools ?? []);

  const toInsert: { name: string; school_id: number | null }[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") { res.errors.push("Skipped non-object entry"); continue; }
    const f = row as Record<string, unknown>;
    const name = (f.name as string | undefined)?.trim();
    if (!name) { res.errors.push("Row missing required field: name"); continue; }

    let school_id: number | null = (f.school_id as number | undefined) ?? null;
    const universityId = f.universityId as string | undefined;
    if (!school_id && universityId) {
      school_id = schoolMap[universityId.toLowerCase()] ?? null;
      if (!school_id) res.warnings.push(`"${name}": school "${universityId}" not found — imported without school`);
    }

    toInsert.push({ name, school_id });
  }

  if (toInsert.length === 0) return res;

  for (const row of toInsert) {
    const { error } = await client.from("faculties").insert(row);
    if (!error) {
      res.inserted++;
    } else if (error.code === "23505") {
      res.warnings.push(`"${row.name}" already exists — skipped`);
    } else {
      res.errors.push(`"${row.name}": ${error.message}`);
    }
  }
  return res;
}

// ── Departments ───────────────────────────────────────────────────────────────

export async function importDepartments(rows: unknown[]): Promise<InsertResult> {
  const res: InsertResult = { label: "Departments", inserted: 0, warnings: [], errors: [] };
  const client = getAdminClient();

  // Build faculty name → id map for resolution
  const { data: allFaculties } = await client.from("faculties").select("id, name");
  const facultyMap: Record<string, number> = {};
  for (const f of allFaculties ?? []) facultyMap[f.name.toLowerCase()] = f.id;

  const toInsert: { name: string; faculty_id: number | null }[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") { res.errors.push("Skipped non-object entry"); continue; }
    const d = row as Record<string, unknown>;
    const name = (d.name as string | undefined)?.trim();
    if (!name) { res.errors.push("Row missing required field: name"); continue; }

    let faculty_id: number | null = (d.faculty_id as number | undefined) ?? null;
    const facultyHint = (d.faculty ?? d.facultyName) as string | undefined;
    if (!faculty_id && facultyHint) {
      faculty_id = matchDept(facultyHint, facultyMap);
      if (!faculty_id) res.warnings.push(`"${name}": faculty "${facultyHint}" not found — imported without faculty`);
    }

    toInsert.push({ name, faculty_id });
  }

  if (toInsert.length === 0) return res;

  for (const row of toInsert) {
    const { error } = await client.from("departments").insert(row);
    if (!error) {
      res.inserted++;
    } else if (error.code === "23505") {
      res.warnings.push(`"${row.name}" already exists — skipped`);
    } else {
      res.errors.push(`"${row.name}": ${error.message}`);
    }
  }
  return res;
}

// ── Professors ────────────────────────────────────────────────────────────────

export async function importProfessors(rows: unknown[]): Promise<InsertResult> {
  const res: InsertResult = { label: "Professors", inserted: 0, warnings: [], errors: [] };
  const client = getAdminClient();

  const { data: allSchools } = await client.from("schools").select("id, website");
  const schoolMap = buildSchoolMap(allSchools ?? []);

  const toInsert: { first_name: string; last_name: string; email: string | null; bio: string | null; school_id: number | null }[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") { res.errors.push("Skipped non-object entry"); continue; }
    const p = row as Record<string, unknown>;
    const rawName = p.name as string | undefined;
    const first_name_raw = p.first_name as string | undefined;
    const displayName = rawName ?? `${first_name_raw ?? ""} ${(p.last_name as string) ?? ""}`.trim();
    if (!displayName) { res.errors.push("Row missing required field: name"); continue; }

    const { first_name, last_name } = first_name_raw
      ? { first_name: first_name_raw, last_name: (p.last_name as string) ?? "" }
      : splitName(rawName!);

    let school_id: number | null = (p.school_id as number | undefined) ?? null;
    const universityId = p.universityId as string | undefined;
    if (!school_id && universityId) {
      school_id = schoolMap[universityId.toLowerCase()] ?? null;
      if (!school_id) res.warnings.push(`"${displayName}": school "${universityId}" not found — imported without school`);
    }

    toInsert.push({ first_name, last_name, email: (p.email as string | null) ?? null, bio: (p.bio as string | null) ?? null, school_id });
  }

  if (toInsert.length === 0) return res;

  for (const row of toInsert) {
    const { error } = await client.from("professors").insert(row);
    if (!error) {
      res.inserted++;
    } else if (error.code === "23505") {
      res.warnings.push(`"${row.first_name} ${row.last_name}" already exists — skipped`);
    } else {
      res.errors.push(`"${row.first_name} ${row.last_name}": ${error.message}`);
    }
  }
  return res;
}

// ── Courses ───────────────────────────────────────────────────────────────────

export async function importCourses(rows: unknown[]): Promise<InsertResult> {
  const res: InsertResult = { label: "Courses", inserted: 0, warnings: [], errors: [] };
  const client = getAdminClient();

  const { data: allDepts } = await client.from("departments").select("id, name");
  const deptMap: Record<string, number> = {};
  for (const d of allDepts ?? []) deptMap[d.name.toLowerCase()] = d.id;

  const toInsert: { course_code: string; name: string; description: string | null; department_id: number | null }[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") { res.errors.push("Skipped non-object entry"); continue; }
    const c = row as Record<string, unknown>;
    const course_code = ((c.code ?? c.course_code) as string | undefined)?.trim();
    const name = ((c.title ?? c.name) as string | undefined)?.trim();
    if (!course_code) { res.errors.push("Row missing required field: code"); continue; }
    if (!name) { res.errors.push(`"${course_code}": missing title/name`); continue; }

    let department_id: number | null = (c.department_id as number | undefined) ?? null;
    const deptHint = c.department as string | undefined;
    if (!department_id && deptHint) {
      // Try hint first, then fall back to the course title
      department_id = matchDept(deptHint, deptMap) ?? matchDept(name, deptMap) ?? null;
      if (!department_id) res.warnings.push(`"${course_code}": department "${deptHint}" not found — imported without department`);
    }

    toInsert.push({ course_code, name, description: (c.description as string | null) ?? null, department_id });
  }

  if (toInsert.length === 0) return res;

  for (const row of toInsert) {
    const { error } = await client.from("courses").insert(row);
    if (!error) {
      res.inserted++;
    } else if (error.code === "23505") {
      res.warnings.push(`"${row.course_code}" already exists — skipped`);
    } else {
      res.errors.push(`"${row.course_code}": ${error.message}`);
    }
  }
  return res;
}

// ── Clear All Data ────────────────────────────────────────────────────────────

export async function clearAllData(): Promise<InsertResult> {
  const res: InsertResult = { label: "Reset", inserted: 0, warnings: [], errors: [] };
  const client = getAdminClient();

  // Delete in FK-safe order (children before parents)
  const steps: Array<{ table: string; run: () => Promise<{ error: any }> }> = [
    {
      table: "attachments",
      run: async () => {
        const { error } = await client.from("attachments").delete().gte("id", 0);
        return { error };
      },
    },
    {
      table: "messages",
      run: async () => {
        const { error } = await client.from("messages").delete().gte("id", 0);
        return { error };
      },
    },
    {
      table: "room_members",
      run: async () => {
        const { error } = await client
          .from("room_members")
          .delete()
          .not("joined_at", "is", null)
          .or("joined_at.is.null");
        return { error };
      },
    },
    {
      table: "rooms",
      run: async () => {
        const { error } = await client.from("rooms").delete().gte("id", 0);
        return { error };
      },
    },
    {
      table: "reviews",
      run: async () => {
        const { error } = await client.from("reviews").delete().gte("id", 0);
        return { error };
      },
    },
    {
      table: "course_professors",
      run: async () => {
        const { error } = await client
          .from("course_professors")
          .delete()
          .or("course_id.gte.0,course_id.is.null");
        return { error };
      },
    },
    {
      table: "course_tags",
      run: async () => {
        const { error } = await client
          .from("course_tags")
          .delete()
          .or("course_id.gte.0,course_id.is.null");
        return { error };
      },
    },
    {
      table: "user_tags",
      run: async () => {
        const { error } = await client
          .from("user_tags")
          .delete()
          .or("tag_id.gte.0,tag_id.is.null");
        return { error };
      },
    },
    {
      table: "courses",
      run: async () => {
        const { error } = await client.from("courses").delete().gte("id", 0);
        return { error };
      },
    },
    {
      table: "departments",
      run: async () => {
        const { error } = await client.from("departments").delete().gte("id", 0);
        return { error };
      },
    },
    {
      table: "faculties",
      run: async () => {
        const { error } = await client.from("faculties").delete().gte("id", 0);
        return { error };
      },
    },
    {
      table: "professors",
      run: async () => {
        const { error } = await client.from("professors").delete().gte("id", 0);
        return { error };
      },
    },
    {
      table: "schools",
      run: async () => {
        const { error } = await client.from("schools").delete().gte("id", 0);
        return { error };
      },
    },
  ];

  for (const { table, run } of steps) {
    const { error } = await run();
    if (error) {
      res.errors.push(`${table}: ${error.message}`);
    } else {
      res.warnings.push(`${table} cleared`);
    }
  }

  // Clear storage bucket
  try {
    const { data: files } = await client.storage.from("room-resources").list("", { limit: 1000 });
    if (files && files.length > 0) {
      const paths = files.map((f) => f.name);
      const { error } = await client.storage.from("room-resources").remove(paths);
      if (error) res.errors.push(`storage: ${error.message}`);
      else res.warnings.push(`storage: ${files.length} file(s) removed`);
    } else {
      res.warnings.push("storage: already empty");
    }
  } catch (e: any) {
    res.warnings.push(`storage: ${e?.message ?? "could not clear"}`);
  }

  return res;
}

// ── Seed All ──────────────────────────────────────────────────────────────────

const SEED_SCHOOLS = [
  { name: "University of New Brunswick", websiteUrl: "https://www.unb.ca/" },
  { name: "St. Thomas University",       websiteUrl: "https://www.stu.ca/" },
  { name: "Mount Allison University",    websiteUrl: "https://www.mta.ca/" },
];

const SEED_FACULTIES = [
  { name: "Faculty of Computer Science",       universityId: "unb" },
  { name: "Faculty of Science, Applied Science, Engineering and Architecture", universityId: "unb" },
  { name: "Faculty of Arts",                   universityId: "stu" },
  { name: "Faculty of Science",                universityId: "mta" },
];

const SEED_DEPARTMENTS = [
  { name: "Computer Science",               faculty: "Faculty of Computer Science" },
  { name: "Mathematics",                    faculty: "Faculty of Science, Applied Science, Engineering and Architecture" },
  { name: "Liberal Arts",                   faculty: "Faculty of Arts" },
  { name: "Mathematics and Computer Science", faculty: "Faculty of Science" },
];

const SEED_COURSES = [
  { code: "CS1073",   title: "Introduction to Computer Programming I",  department: "Computer Science",               description: "Fundamentals of programming in Python: variables, control flow, functions, and basic data structures." },
  { code: "CS1083",   title: "Introduction to Computer Programming II", department: "Computer Science",               description: "Object-oriented programming, recursion, searching and sorting algorithms, and introductory data structures." },
  { code: "CS2043",   title: "Unix Tools and Scripting",                department: "Computer Science",               description: "The Unix/Linux environment, shell scripting, and essential command-line tools for software development." },
  { code: "CS2263",   title: "Systems Software Development",            department: "Computer Science",               description: "Software engineering principles, version control, testing, and agile development practices." },
  { code: "CS2383",   title: "Data Structures and Algorithms",          department: "Computer Science",               description: "Core data structures and algorithm design techniques including trees, graphs, sorting, and complexity analysis." },
  { code: "CS3383",   title: "Theory of Computation",                   department: "Computer Science",               description: "Automata theory, formal languages, computability, and complexity classes P and NP." },
  { code: "COMP1631", title: "Introduction to Computer Science",        department: "Mathematics and Computer Science", description: "Problem solving, algorithm design, and programming fundamentals at Mount Allison University." },
];

export async function seedAll(): Promise<InsertResult[]> {
  return [
    await importSchools(SEED_SCHOOLS),
    await importFaculties(SEED_FACULTIES),
    await importDepartments(SEED_DEPARTMENTS),
    await importCourses(SEED_COURSES),
  ];
}

// ── Course Descriptions ────────────────────────────────────────────────────────

export async function updateCourseDescriptions(rows: unknown[]): Promise<InsertResult> {
  const res: InsertResult = { label: "Descriptions", inserted: 0, warnings: [], errors: [] };
  const client = getAdminClient();

  for (const row of rows) {
    if (!row || typeof row !== "object") { res.errors.push("Skipped non-object entry"); continue; }
    const c = row as Record<string, unknown>;
    const code = ((c.code ?? c.course_code) as string | undefined)?.trim();
    const description = (c.description as string | undefined)?.trim();
    if (!code) { res.errors.push("Row missing required field: code"); continue; }
    if (!description) { res.errors.push(`"${code}": missing description`); continue; }

    const { error } = await client
      .from("courses")
      .update({ description })
      .eq("course_code", code);

    if (!error) {
      res.inserted++;
    } else {
      res.errors.push(`"${code}": ${error.message}`);
    }
  }
  return res;
}
