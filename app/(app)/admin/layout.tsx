import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getAuthenticatedProfile } from "@/lib/supabase/server";

/**
 * Admin layout — server-side role guard.
 * Middleware already blocks non-admins, but this is a second line of defense
 * in case someone reaches this layout directly (e.g. during dev without env vars).
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const profile = await getAuthenticatedProfile();

  // Not logged in
  if (!profile) {
    redirect("/login?next=/admin");
  }

  // Logged in but not an admin
  if (profile.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <>
      <div className="border-b border-amber-800/40 bg-amber-950/30 px-4 py-2 text-xs font-medium text-amber-400">
        Admin area — changes are written directly to the database.
      </div>
      {children}
    </>
  );
}
