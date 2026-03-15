import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

export type School = Database["public"]["Tables"]["schools"]["Row"];
export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type CourseWithDepartment = Course & {
  department_name: string | null;
  school_id: number | null;
  school_name: string | null;
};

// Used in AuthForm for school picker during signup (public, no auth required)
export async function listSchools(): Promise<School[]> {
  if (!isSupabaseConfigured()) return [];
  const client = getSupabaseBrowserClient();
  if (!client) return [];
  const { data, error } = await client.from("schools").select("*").order("name");
  if (error || !data) return [];
  return data;
}
