import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

export type Room = Database["public"]["Tables"]["rooms"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type RoomMember = Database["public"]["Tables"]["room_members"]["Row"];

const MOCK_ROOMS: Room[] = [
  {
    id: 1,
    name: "CSC 201 – Data Structures",
    course_id: 1,
    creator_id: null,
    is_public: true,
    created_at: null,
    updated_at: null
  },
  {
    id: 2,
    name: "EEE 101 – Intro to Electrical Engineering",
    course_id: 2,
    creator_id: null,
    is_public: true,
    created_at: null,
    updated_at: null
  }
];

const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    text: "Anyone has past questions for CSC 201 midterm?",
    room_id: 1,
    author_id: null,
    parent_id: null,
    section: "main",
    created_at: null,
    updated_at: null
  },
  {
    id: 2,
    text: "Just dropped a Notion doc summarizing all the lectures 📚",
    room_id: 1,
    author_id: null,
    parent_id: null,
    section: "main",
    created_at: null,
    updated_at: null
  }
];

export async function listRoomsByCourse(courseId: number | null): Promise<Room[]> {
  if (!courseId || !isSupabaseConfigured()) {
    return MOCK_ROOMS.filter((r) => (courseId ? r.course_id === courseId : true));
  }

  const client = getSupabaseBrowserClient();
  if (!client) {
    return MOCK_ROOMS.filter((r) => (courseId ? r.course_id === courseId : true));
  }

  const { data, error } = await client.from("rooms").select("*").eq("course_id", courseId);
  if (error || !data) {
    console.warn("Failed to load rooms from Supabase, using mock rooms", error);
    return MOCK_ROOMS.filter((r) => (courseId ? r.course_id === courseId : true));
  }

  return data;
}

export async function listRoomMessages(roomId: number | null, section: "main" | "resources" = "main") {
  if (!roomId || !isSupabaseConfigured()) {
    return MOCK_MESSAGES.filter((m) => m.room_id === roomId && m.section === section);
  }

  const client = getSupabaseBrowserClient();
  if (!client) {
    return MOCK_MESSAGES.filter((m) => m.room_id === roomId && m.section === section);
  }

  const { data, error } = await client
    .from("messages")
    .select("*")
    .eq("room_id", roomId)
    .eq("section", section)
    .order("created_at", { ascending: true });

  if (error || !data) {
    console.warn("Failed to load messages from Supabase, using mock messages", error);
    return MOCK_MESSAGES.filter((m) => m.room_id === roomId && m.section === section);
  }

  return data;
}

