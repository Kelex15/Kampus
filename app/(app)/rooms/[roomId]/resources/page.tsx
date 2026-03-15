"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RoomResourcesPage() {
  const { roomId } = useParams();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/rooms/${roomId}/chat`);
  }, [roomId, router]);

  return null;
}
