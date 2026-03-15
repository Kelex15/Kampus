"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type School = Database["public"]["Tables"]["schools"]["Row"];

export async function fetchProfileAction(userId: string): Promise<Profile | null> {
  const client = createSupabaseServerClient();
  const { data } = await client
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return data ?? null;
}

export async function fetchSchoolByIdAction(schoolId: number): Promise<School | null> {
  const client = createSupabaseServerClient();
  const { data } = await client
    .from("schools")
    .select("*")
    .eq("id", schoolId)
    .maybeSingle();
  return data ?? null;
}

export async function listSchoolsAction(): Promise<School[]> {
  const client = createSupabaseServerClient();
  const { data } = await client.from("schools").select("*").order("name");
  return data ?? [];
}

export async function updateProfileSchoolAction(userId: string, schoolId: number): Promise<{ error: string | null }> {
  const client = createSupabaseServerClient();
  const { error } = await client
    .from("profiles")
    .update({ school_id: schoolId })
    .eq("id", userId);
  return { error: error?.message ?? null };
}
