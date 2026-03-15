import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

export type Professor = Database["public"]["Tables"]["professors"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];

const MOCK_PROFESSORS: Professor[] = [
  {
    id: 1,
    first_name: "Sarah",
    last_name: "Chen",
    email: "s.chen@utoronto.ca",
    avatar_url: null,
    bio: "Research interests: algorithms and computational complexity.",
    school_id: 1,
    created_at: null
  },
  {
    id: 2,
    first_name: "James",
    last_name: "MacAllister",
    email: "j.macallister@utoronto.ca",
    avatar_url: null,
    bio: "Specializes in distributed systems and cloud infrastructure.",
    school_id: 1,
    created_at: null
  },
  {
    id: 3,
    first_name: "Marie",
    last_name: "Tremblay",
    email: "m.tremblay@mcgill.ca",
    avatar_url: null,
    bio: "Quantum computing and applied mathematics.",
    school_id: 3,
    created_at: null
  }
];

const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    rating: 5,
    comment: "Explains complex concepts with real-world stories.",
    professor_id: 1,
    author_id: null,
    created_at: null,
    updated_at: null
  },
  {
    id: 2,
    rating: 4,
    comment: "Challenging exams but very fair grading.",
    professor_id: 1,
    author_id: null,
    created_at: null,
    updated_at: null
  },
  {
    id: 3,
    rating: 3,
    comment: "Labs are great, lectures can be fast.",
    professor_id: 2,
    author_id: null,
    created_at: null,
    updated_at: null
  }
];

export async function listProfessors(): Promise<Professor[]> {
  if (!isSupabaseConfigured()) return MOCK_PROFESSORS;

  const client = getSupabaseBrowserClient();
  if (!client) return MOCK_PROFESSORS;

  const { data, error } = await client.from("professors").select("*");
  if (error || !data) {
    console.warn("Failed to load professors from Supabase, using mock data", error);
    return MOCK_PROFESSORS;
  }
  return data;
}

export async function listProfessorReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured()) return MOCK_REVIEWS;

  const client = getSupabaseBrowserClient();
  if (!client) return MOCK_REVIEWS;

  const { data, error } = await client.from("reviews").select("*");
  if (error || !data) {
    console.warn("Failed to load reviews from Supabase, using mock data", error);
    return MOCK_REVIEWS;
  }
  return data;
}

