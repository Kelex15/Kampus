"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { fetchMessagesAction, sendMessageAction } from "@/app/(app)/rooms/[roomId]/actions";
import type { Database } from "@/types/database.types";

export type Message = Database["public"]["Tables"]["messages"]["Row"];

export function useMessages(roomId: number, section: "main" | "resources" = "main") {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesRef = useRef<Message[]>([]);

  // Initial load via server action (avoids browser Web Lock contention)
  useEffect(() => {
    let cancelled = false;
    fetchMessagesAction(roomId, section).then((data) => {
      if (cancelled) return;
      setMessages(data);
      messagesRef.current = data;
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [roomId, section]);

  // Realtime subscription — WebSocket, no lock contention
  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;

    const channel = client
      .channel(`room-messages:${roomId}:${section}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.section !== section) return;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => { client.removeChannel(channel); };
  }, [roomId, section]);

  async function sendMessage(text: string, authorId: string | null = null) {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Optimistic update
    const optimistic: Message = {
      id: Date.now(),
      text: trimmed,
      room_id: roomId,
      author_id: authorId,
      parent_id: null,
      section,
      created_at: new Date().toISOString(),
      updated_at: null,
    };
    setMessages((prev) => [...prev, optimistic]);

    const { error } = await sendMessageAction(roomId, trimmed, authorId, section);
    if (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    }
  }

  return { messages, loading, sendMessage };
}
