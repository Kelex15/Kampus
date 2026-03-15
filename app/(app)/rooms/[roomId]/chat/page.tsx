"use client";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { allCourses } from "@/lib/data";
import CourseShell from "@/components/CourseShell";
import PageShell from "@/components/shared/PageShell";

export default function RoomChatPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const course = useMemo(
    () => allCourses.find((c) => c.id === roomId) ?? allCourses[0],
    [roomId]
  );
  return (
    <PageShell showNav={false}>
      <CourseShell course={course} joined={true} />
    </PageShell>
  );
}
