"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

export type Message = Database["public"]["Tables"]["messages"]["Row"];

const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    text: "Does anyone have past exams for CSC263? The midterm is next week.",
    room_id: 1,
    author_id: null,
    parent_id: null,
    section: "main",
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    updated_at: null
  },
  {
    id: 2,
    text: "Just posted a Notion summary of all the lecture slides in Resources 📚",
    room_id: 1,
    author_id: null,
    parent_id: null,
    section: "main",
    created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    updated_at: null
  }
];

/**
 * Loads messages for a room and subscribes to realtime inserts via Supabase.
 * Falls back to mock data when Supabase isn't configured.
 */
export function useMessages(roomId: number, section: "main" | "resources" = "main") {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  // Keep a stable ref so the realtime callback always sees the latest messages
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    let cancelled = false;
    const client = getSupabaseBrowserClient();

    async function load() {
      setLoading(true);

      if (!isSupabaseConfigured() || !client) {
        const mock = MOCK_MESSAGES.filter(
          (m) => m.room_id === roomId && m.section === section
        );
        if (!cancelled) {
          setMessages(mock);
          messagesRef.current = mock;
          setLoading(false);
        }
        return;
      }

      const { data, error } = await client
        .from("messages")
        .select("*")
        .eq("room_id", roomId)
        .eq("section", section)
        .order("created_at", { ascending: true });

      if (!cancelled) {
        const initial = error || !data ? [] : data;
        setMessages(initial);
        messagesRef.current = initial;
        setLoading(false);
      }
    }

    load();

    // Set up Supabase Realtime subscription for INSERT events
    if (!isSupabaseConfigured() || !client) return;

    const channel = client
      .channel(`room-messages:${roomId}:${section}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          // Only add if it matches the current section
          if (newMsg.section !== section) return;
          setMessages((prev) => {
            // Deduplicate in case optimistic update already added it
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      client.removeChannel(channel);
    };
  }, [roomId, section]);

  /**
   * Send a message. Inserts into Supabase if configured, otherwise appends locally.
   */
  async function sendMessage(text: string, authorId: string | null = null) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const client = getSupabaseBrowserClient();

    if (!isSupabaseConfigured() || !client) {
      // Local-only optimistic append
      const optimistic: Message = {
        id: Date.now(),
        text: trimmed,
        room_id: roomId,
        author_id: authorId,
        parent_id: null,
        section,
        created_at: new Date().toISOString(),
        updated_at: null
      };
      setMessages((prev) => [...prev, optimistic]);
      return;
    }

    // Optimistic update
    const optimistic: Message = {
      id: Date.now(), // temp id
      text: trimmed,
      room_id: roomId,
      author_id: authorId,
      parent_id: null,
      section,
      created_at: new Date().toISOString(),
      updated_at: null
    };
    setMessages((prev) => [...prev, optimistic]);

    const { error } = await client.from("messages").insert({
      text: trimmed,
      room_id: roomId,
      author_id: authorId,
      section
    });

    if (error) {
      console.error("Failed to send message:", error);
      // Roll back optimistic update
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    }
    // Realtime subscription will receive the real row and deduplicate
  }

  return { messages, loading, sendMessage };
}
