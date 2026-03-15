"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { fetchProfileAction, type Profile } from "@/app/actions/profile";

export type { Profile };

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function isAbortError(err: unknown) {
  return (
    typeof err === "object" &&
    err !== null &&
    "name" in err &&
    (err as any).name === "AbortError"
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    // Resolve the current session once. This avoids depending on
    // onAuthStateChange's INITIAL_SESSION emission (which can be flaky in dev)
    // and prevents pages being stuck in loading forever.
    (async () => {
      try {
        const { data: { session } } = await client.auth.getSession();
        if (cancelled) return;
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (!currentUser) setProfile(null);
      } catch (err) {
        if (cancelled) return;
        // Web Lock contention can surface as AbortError; don't crash the app.
        if (!isAbortError(err)) {
          console.warn("Auth init failed:", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    // Synchronous auth state listener — ZERO browser-side DB calls inside.
    // onAuthStateChange holds the Web Lock for its entire callback duration.
    // Any client.from() call inside would try to re-acquire the same lock → abort.
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) setProfile(null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch profile via server action — completely outside the Web Lock context.
  // Runs whenever the authenticated user's ID changes (login / logout / switch).
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetchProfileAction(user.id)
      .then((p) => {
        if (cancelled) return;
        setProfile(p);
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn("Failed to fetch profile:", err);
        setProfile(null);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const signOut = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    try {
      await client?.auth.signOut();
    } finally {
      setUser(null);
      setProfile(null);
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ user, profile, loading, signOut }), [user, profile, loading, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }

  return ctx;
}
