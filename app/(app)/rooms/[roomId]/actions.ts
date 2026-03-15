"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type Attachment = Database["public"]["Tables"]["attachments"]["Row"];
export type ResourceMessage = Message & { attachment: Attachment | null };

// ── Room ──────────────────────────────────────────────────────────────────────

export async function getOrCreateRoomAction(slug: string): Promise<number | null> {
  const client = createSupabaseServerClient();

  const { data: existing } = await client
    .from("rooms")
    .select("id")
    .eq("name", slug)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await client
    .from("rooms")
    .insert({ name: slug, is_public: true })
    .select("id")
    .single();

  if (error || !created) return null;
  return created.id;
}

// ── Course ────────────────────────────────────────────────────────────────────

export async function fetchCourseAction(courseCode: string) {
  const client = createSupabaseServerClient();

  const { data, error } = await client
    .from("courses")
    .select("*, departments(name)")
    .eq("course_code", courseCode)
    .maybeSingle();

  if (error || !data) return null;

  return {
    ...(data as any),
    department_name: (data as any).departments?.name ?? null,
    departments: undefined,
  };
}

// ── Messages ──────────────────────────────────────────────────────────────────

export async function fetchMessagesAction(
  roomId: number,
  section: "main" | "resources" = "main"
): Promise<Message[]> {
  const client = createSupabaseServerClient();

  const { data, error } = await client
    .from("messages")
    .select("*")
    .eq("room_id", roomId)
    .eq("section", section)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function sendMessageAction(
  roomId: number,
  text: string,
  authorId: string | null,
  section: "main" | "resources" = "main"
): Promise<{ error: string | null }> {
  const client = createSupabaseServerClient();

  const { error } = await client
    .from("messages")
    .insert({ text, room_id: roomId, author_id: authorId, section });

  return { error: error?.message ?? null };
}

// ── Resources ─────────────────────────────────────────────────────────────────

export async function fetchResourcesAction(roomId: number): Promise<ResourceMessage[]> {
  const client = createSupabaseServerClient();

  const { data: messages, error } = await client
    .from("messages")
    .select("*")
    .eq("room_id", roomId)
    .eq("section", "resources")
    .order("created_at", { ascending: false });

  if (error || !messages) return [];

  const ids = messages.map((m) => m.id);
  const { data: attachments } = ids.length
    ? await client.from("attachments").select("*").in("message_id", ids)
    : { data: [] };

  const attachmentMap = new Map((attachments ?? []).map((a) => [a.message_id, a]));
  return messages.map((m) => ({ ...m, attachment: attachmentMap.get(m.id) ?? null }));
}

export async function postLinkAction(
  roomId: number,
  url: string,
  authorId: string | null
): Promise<{ error: string | null }> {
  const client = createSupabaseServerClient();

  const { error } = await client
    .from("messages")
    .insert({ text: url.trim(), room_id: roomId, author_id: authorId, section: "resources" });

  return { error: error?.message ?? null };
}

export async function uploadFileAction(
  formData: FormData
): Promise<{ url: string | null; messageId: number | null; attachment: Attachment | null; error: string | null }> {
  const client = createSupabaseServerClient();

  const file = formData.get("file") as File;
  const roomId = Number(formData.get("roomId"));
  const authorId = (formData.get("authorId") as string | null) || null;

  if (!file || !roomId) return { url: null, messageId: null, attachment: null, error: "Missing file or room" };

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${roomId}/${Date.now()}-${safeName}`;

  const bytes = await file.arrayBuffer();
  const { data: storageData, error: storageError } = await client.storage
    .from("room-resources")
    .upload(path, bytes, { contentType: file.type });

  if (storageError) return { url: null, messageId: null, attachment: null, error: storageError.message };

  const { data: { publicUrl } } = client.storage.from("room-resources").getPublicUrl(storageData.path);

  const { data: message, error: msgError } = await client
    .from("messages")
    .insert({ text: file.name, room_id: roomId, author_id: authorId, section: "resources" })
    .select()
    .single();

  if (msgError || !message) return { url: publicUrl, messageId: null, attachment: null, error: msgError?.message ?? "Failed to save message" };

  const { data: attachment, error: attachError } = await client
    .from("attachments")
    .insert({ url: publicUrl, type: "file", mime_type: file.type, size: file.size, message_id: message.id })
    .select()
    .single();

  if (attachError) return { url: publicUrl, messageId: message.id, attachment: null, error: attachError.message };

  return { url: publicUrl, messageId: message.id, attachment, error: null };
}
