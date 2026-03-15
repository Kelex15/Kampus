// Room types — DB operations are handled via server actions in app/(app)/rooms/[roomId]/actions.ts
import type { Database } from "@/types/database.types";

export type Room = Database["public"]["Tables"]["rooms"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type RoomMember = Database["public"]["Tables"]["room_members"]["Row"];
