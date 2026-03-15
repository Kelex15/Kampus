"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CourseWithDepartment } from "@/queries/schools";

export async function fetchCourses(schoolId?: number | null): Promise<CourseWithDepartment[]> {
  const client = createSupabaseServerClient();

  // When a school is specified, resolve its department IDs so we can filter at
  // the courses level (PostgREST doesn't support filtering on nested joins directly).
  let deptIds: number[] | null = null;
  if (schoolId) {
    const { data: faculties } = await client
      .from("faculties")
      .select("id")
      .eq("school_id", schoolId);

    const facultyIds = (faculties ?? []).map((f) => f.id);
    if (facultyIds.length === 0) return [];

    const { data: depts } = await client
      .from("departments")
      .select("id")
      .in("faculty_id", facultyIds);

    deptIds = (depts ?? []).map((d) => d.id);
    if (deptIds.length === 0) return [];
  }

  let query = client
    .from("courses")
    .select("*, departments(name, faculties(school_id, schools(id, name)))")
    .order("course_code");

  if (deptIds) {
    query = query.in("department_id", deptIds) as typeof query;
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return (data as any[]).map((c) => ({
    ...c,
    department_name: c.departments?.name ?? null,
    school_id: c.departments?.faculties?.school_id ?? null,
    school_name: c.departments?.faculties?.schools?.name ?? null,
    departments: undefined,
  }));
}
