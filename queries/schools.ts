import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

export type School = Database["public"]["Tables"]["schools"]["Row"];
export type Course = Database["public"]["Tables"]["courses"]["Row"];

const MOCK_SCHOOLS: School[] = [
  { id: 1, name: "University of Toronto", website: "https://utoronto.ca", created_at: null },
  { id: 2, name: "University of British Columbia", website: "https://ubc.ca", created_at: null },
  { id: 3, name: "McGill University", website: "https://mcgill.ca", created_at: null }
];

const MOCK_COURSES: Course[] = [
  {
    id: 1,
    course_code: "CSC263",
    name: "Data Structures and Analysis",
    description: null,
    department_id: 1,
    created_at: null
  },
  {
    id: 2,
    course_code: "ECE259",
    name: "Electricity and Magnetism",
    description: null,
    department_id: 1,
    created_at: null
  },
  {
    id: 3,
    course_code: "MAT137",
    name: "Calculus with Proofs",
    description: null,
    department_id: 1,
    created_at: null
  },
  {
    id: 4,
    course_code: "RSM250",
    name: "Introduction to Marketing",
    description: null,
    department_id: 2,
    created_at: null
  }
];

export async function listSchools(): Promise<School[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_SCHOOLS;
  }

  const client = getSupabaseBrowserClient();
  if (!client) return MOCK_SCHOOLS;

  const { data, error } = await client.from("schools").select("*").order("name");
  if (error || !data) {
    console.warn("Failed to load schools from Supabase, falling back to mock data", error);
    return MOCK_SCHOOLS;
  }
  return data;
}

export async function listCoursesBySchool(schoolId: number | null): Promise<Course[]> {
  if (!isSupabaseConfigured() || !schoolId) {
    return MOCK_COURSES;
  }

  const client = getSupabaseBrowserClient();
  if (!client) return MOCK_COURSES;

  const { data, error } = await client
    .from("courses")
    .select("*")
    .eq("department_id", schoolId)
    .order("course_code");

  if (error || !data) {
    console.warn("Failed to load courses from Supabase, falling back to mock data", error);
    return MOCK_COURSES;
  }
  return data;
}

