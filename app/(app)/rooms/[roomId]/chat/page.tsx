"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import CourseShell from "@/components/CourseShell";
import PageShell from "@/components/shared/PageShell";
import { getOrCreateRoomAction, fetchCourseAction } from "../actions";
import type { CourseWithDepartment } from "@/queries/schools";

export default function RoomChatPage() {
  const params = useParams();
  const rawId = params.roomId;
  const slug = Array.isArray(rawId) ? rawId[0] : rawId;

  const [roomId, setRoomId] = useState<number | null>(null);
  const [course, setCourse] = useState<CourseWithDepartment | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      getOrCreateRoomAction(slug),
      fetchCourseAction(slug),
    ]).then(([rid, c]) => {
      setRoomId(rid);
      setCourse(c);
      setReady(true);
    });
  }, [slug]);

  if (!ready) {
    return (
      <PageShell showNav={false}>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-green-600" size={32} />
        </div>
      </PageShell>
    );
  }

  if (!roomId) {
    return (
      <PageShell showNav={false}>
        <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold">
          Room not found.
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell showNav={false}>
      <CourseShell course={course} slug={slug!} roomId={roomId} joined={true} />
    </PageShell>
  );
}
