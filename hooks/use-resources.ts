"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client"; // still needed for realtime
import { fetchResourcesAction, postLinkAction, uploadFileAction } from "@/app/(app)/rooms/[roomId]/actions";
import type { Database } from "@/types/database.types";

export type ResourceMessage = Database["public"]["Tables"]["messages"]["Row"] & {
  attachment: Database["public"]["Tables"]["attachments"]["Row"] | null;
};

export const ACCEPTED_FILE_TYPES = ".pdf,.txt,.json,.doc,.docx,.md";

const ACCEPTED_MIME = new Set([
  "application/pdf",
  "text/plain",
  "application/json",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/markdown",
]);

export function isValidFile(file: File) {
  return ACCEPTED_MIME.has(file.type) || file.name.endsWith(".md");
}

export function isUrl(text: string) {
  return /^https?:\/\//i.test(text.trim());
}

export function formatBytes(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileEmoji(mimeType: string | null, name: string) {
  if (!mimeType) {
    if (name.endsWith(".md")) return "📋";
    return "📁";
  }
  if (mimeType === "application/pdf") return "📄";
  if (mimeType === "application/json") return "🔧";
  if (mimeType.includes("word")) return "📝";
  if (mimeType === "text/plain") return "📃";
  if (mimeType === "text/markdown") return "📋";
  return "📁";
}

export function useResources(roomId: number) {
  const [resources, setResources] = useState<ResourceMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Initial load via server action
  useEffect(() => {
    let cancelled = false;
    fetchResourcesAction(roomId).then((data) => {
      if (cancelled) return;
      setResources(data);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [roomId]);

  // Realtime subscription — WebSocket, no lock contention
  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;

    const channel = client
      .channel(`room-resources:${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
        (payload) => {
          const msg = payload.new as Database["public"]["Tables"]["messages"]["Row"];
          if (msg.section !== "resources") return;
          setResources((prev) => {
            if (prev.some((r) => r.id === msg.id)) return prev;
            return [{ ...msg, attachment: null }, ...prev];
          });
        }
      )
      .subscribe();

    return () => { client.removeChannel(channel); };
  }, [roomId]);

  async function postLink(url: string, authorId: string | null) {
    const text = url.trim();
    if (!text) return;

    // Optimistic update
    const optimistic: ResourceMessage = {
      id: Date.now(),
      text,
      room_id: roomId,
      author_id: authorId,
      parent_id: null,
      section: "resources",
      created_at: new Date().toISOString(),
      updated_at: null,
      attachment: null,
    };
    setResources((prev) => [optimistic, ...prev]);

    const { error } = await postLinkAction(roomId, text, authorId);
    if (error) {
      setResources((prev) => prev.filter((r) => r.id !== optimistic.id));
    }
  }

  async function uploadFile(file: File, authorId: string | null) {
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("roomId", String(roomId));
      if (authorId) formData.append("authorId", authorId);

      const { messageId, attachment, error } = await uploadFileAction(formData);

      if (error) { setUploadError(error); return; }

      if (messageId && attachment) {
        setResources((prev) => {
          if (prev.some((r) => r.id === messageId)) {
            return prev.map((r) => r.id === messageId ? { ...r, attachment } : r);
          }
          return [{ id: messageId, text: file.name, room_id: roomId, author_id: authorId, parent_id: null, section: "resources", created_at: new Date().toISOString(), updated_at: null, attachment }, ...prev];
        });
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return { resources, loading, uploading, uploadError, postLink, uploadFile };
}
