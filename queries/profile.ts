import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Simple sample profile for local/demo mode
const MOCK_PROFILE: Profile = {
  id: "00000000-0000-0000-0000-000000000000",
  username: "alex.student",
  first_name: "Alex",
  last_name: "Student",
  avatar_url: null,
  current_year: 2,
  type: "student",
  role: "user",
  school_id: 1,
  created_at: null,
  updated_at: null
};

/**
 * Fetch the current user's profile.
 * In a real app you would pass the authenticated user id from Supabase Auth.
 */
export async function getProfile(userId: string | null): Promise<Profile | null> {
  if (!userId || !isSupabaseConfigured()) {
    return MOCK_PROFILE;
  }

  const client = getSupabaseBrowserClient();
  if (!client) return MOCK_PROFILE;

  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.warn("Failed to load profile from Supabase, using mock profile", error);
    return MOCK_PROFILE;
  }

  return data ?? MOCK_PROFILE;
}

