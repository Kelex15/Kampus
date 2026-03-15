"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CourseWithDepartment } from "@/queries/schools";

export async function fetchCourses(schoolId?: number | null): Promise<CourseWithDepartment[]> {
  const client = createSupabaseServerClient();

  // school_id is now a direct column on courses — no multi-step join needed.
  let query = client
    .from("courses")
    .select("*, departments(name, faculties(schools(id, name)))")
    .order("course_code");

  if (schoolId) {
    query = query.eq("school_id", schoolId) as typeof query;
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return (data as any[]).map((c) => ({
    ...c,
    department_name: c.departments?.name ?? null,
    school_id: c.school_id ?? null,
    school_name: c.departments?.faculties?.schools?.name ?? null,
    departments: undefined,
  }));
}
