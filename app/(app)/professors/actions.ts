"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type Professor = Database["public"]["Tables"]["professors"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];

export async function fetchProfessorsAction(): Promise<Professor[]> {
  const client = createSupabaseServerClient();
  const { data, error } = await client.from("professors").select("*").order("last_name");
  if (error || !data) return [];
  return data;
}

export async function fetchReviewsAction(): Promise<Review[]> {
  const client = createSupabaseServerClient();
  const { data, error } = await client.from("reviews").select("*");
  if (error || !data) return [];
  return data;
}

export async function submitReviewAction(
  professorId: number,
  rating: number,
  comment: string,
  authorId: string | null
): Promise<{ data: Review | null; error: string | null }> {
  const client = createSupabaseServerClient();
  const { data, error } = await client
    .from("reviews")
    .insert({ professor_id: professorId, rating, comment, author_id: authorId })
    .select()
    .single();
  if (error || !data) return { data: null, error: error?.message ?? "Failed to submit review" };
  return { data, error: null };
}
