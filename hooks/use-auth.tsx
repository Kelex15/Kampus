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
  /** True once both auth and profile have resolved. Use this as the fetch gate. */
  ready: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      setAuthLoading(false);
      return;
    }

    // onAuthStateChange fires INITIAL_SESSION synchronously on subscribe with
    // the current session from cookies — this is the correct replacement for
    // getSession(). Using both causes concurrent Web Lock acquisitions which
    // surfaces as "The lock request is aborted" DOMExceptions.
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setAuthLoading(false);
      if (!currentUser) {
        setProfile(null);
        setProfileLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch profile via server action — completely outside the Web Lock context.
  // Runs whenever the authenticated user's ID changes (login / logout / switch).
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setProfileLoading(true);
    fetchProfileAction(user.id)
      .then((p) => {
        if (cancelled) return;
        setProfile(p);
      })
      .catch(() => {
        if (cancelled) return;
        setProfile(null);
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
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
      setAuthLoading(false);
      setProfileLoading(false);
    }
  }, []);

  // ready = auth resolved AND profile resolved (or no user logged in)
  const ready = !authLoading && !profileLoading;

  const value = useMemo<AuthContextValue>(
    () => ({ user, profile, loading: authLoading, ready, signOut }),
    [user, profile, authLoading, ready, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
