// Professor types — DB operations are handled via server actions in app/(app)/professors/actions.ts
import type { Database } from "@/types/database.types";

export type Professor = Database["public"]["Tables"]["professors"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
