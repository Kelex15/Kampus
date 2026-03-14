"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { allCourses } from "@/lib/data";
import CourseShell from "@/components/CourseShell";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Home } from "lucide-react";

/* ─── Decorative SVG doodles ─── */

function DoodleStar({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
            <path
                d="M16 2L19.5 12.5L30 16L19.5 19.5L16 30L12.5 19.5L2 16L12.5 12.5Z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function DoodleZigzag({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 80 20" fill="none" aria-hidden>
            <path
                d="M2 18L12 2L22 18L32 2L42 18L52 2L62 18L72 2L78 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function DoodleCircle({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
            <path
                d="M24 4C35 4 44 13 44 24C44 35 35 44 24 44C13 44 4 35 4 24C4 13 13 3 25 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

function DoodleCross({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
            <path
                d="M4 4L16 16M16 4L4 16"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

function DoodleArrow({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 64 40" fill="none" aria-hidden>
            <path
                d="M4 36C12 12 28 4 52 8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path
                d="M46 2L52 8L44 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function DoodleSpring({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 60" fill="none" aria-hidden>
            <path
                d="M12 4C20 4 20 12 12 12C4 12 4 20 12 20C20 20 20 28 12 28C4 28 4 36 12 36C20 36 20 44 12 44C4 44 4 52 12 52"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function DotGrid({ className }: { className?: string }) {
    return (
        <div
            className={`absolute inset-0 pointer-events-none ${className || ""}`}
            aria-hidden
            style={{
                backgroundImage:
                    "radial-gradient(circle, #9ca3af 1px, transparent 1px)",
                backgroundSize: "28px 28px",
            }}
        />
    );
}

function GridPattern({ className }: { className?: string }) {
    return (
        <div
            className={`absolute inset-0 pointer-events-none ${className || ""}`}
            aria-hidden
            style={{
                backgroundImage:
                    "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                backgroundSize: "48px 48px",
            }}
        />
    );
}

export default function CoursePage() {
    const params = useParams() as { id?: string };
    const search = useSearchParams();
    const id = params?.id ?? "";
    const joined = search?.get("joined") === "1";

    const course = useMemo(() => allCourses.find((c) => c.id === id), [id]);

    if (!course) {
        return (
            <div className="min-h-screen bg-green-50 relative overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6">
                {/* Background texture */}
                <DotGrid className="opacity-[0.15]" />

                {/* Scattered doodles */}
                <DoodleStar className="absolute top-16 right-8 sm:right-20 w-7 h-7 sm:w-9 sm:h-9 text-green-600/40 rotate-12" />
                <DoodleStar className="absolute bottom-24 left-12 w-5 h-5 text-green-600/25 -rotate-6 hidden sm:block" />
                <DoodleCircle className="absolute top-24 left-8 sm:left-20 w-10 h-10 sm:w-14 sm:h-14 text-green-600/20 hidden sm:block" />
                <DoodleZigzag className="absolute bottom-12 right-6 sm:right-16 w-16 sm:w-24 text-green-600/20 hidden lg:block" />
                <DoodleCross className="absolute top-32 right-[35%] w-5 h-5 text-green-600/15 hidden md:block" />
                <DoodleArrow className="absolute bottom-32 left-[15%] w-14 sm:w-20 text-green-600/20 rotate-6 hidden sm:block" />
                <DoodleSpring className="absolute top-[30%] right-[15%] w-5 h-auto text-green-600/15 hidden xl:block" />
                <DoodleStar className="absolute top-[60%] left-[10%] w-6 h-6 text-green-600/15 rotate-45 hidden lg:block" />
                <DoodleCircle className="absolute bottom-[40%] right-[10%] w-8 h-8 text-green-600/15 hidden lg:block" />
                <DoodleCross className="absolute bottom-16 left-[45%] w-4 h-4 text-green-600/10 hidden md:block" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative text-center max-w-lg mx-auto"
                >
                    {/* Main card */}
                    <div className="bg-white border-2 border-gray-900 rounded-xl p-8 sm:p-10 lg:p-12 shadow-[6px_6px_0px_#16a34a]">
                        {/* Icon box */}
                        <div className="relative inline-block mb-6 sm:mb-8">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-50 border-2 border-gray-900 rounded-xl flex items-center justify-center shadow-[4px_4px_0px_#16a34a]">
                                <span className="text-4xl sm:text-5xl">🔍</span>
                            </div>
                            <DoodleStar className="absolute -top-3 -right-3 w-6 h-6 text-green-600/50 rotate-12" />
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-3 sm:mb-4 tracking-tight">
                            Course not found
                        </h1>

                        <p className="text-gray-500 text-base sm:text-lg font-medium mb-8 sm:mb-10 max-w-sm mx-auto leading-relaxed">
                            This room doesn&apos;t exist or may have been
                            removed. Maybe it graduated already.
                        </p>

                        {/* Dashed divider */}
                        <div className="border-t-2 border-dashed border-gray-200 mb-8 sm:mb-10" />

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href="/discover"
                                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-green-600 text-white text-base font-bold rounded-xl border-2 border-green-600 hover:bg-green-700 hover:border-green-700 transition-all active:scale-[0.97] shadow-[4px_4px_0px_#111827]"
                            >
                                Browse courses
                                <ArrowRight
                                    size={18}
                                    className="group-hover:translate-x-0.5 transition-transform"
                                />
                            </Link>
                            <Link
                                href="/"
                                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-gray-900 text-base font-bold rounded-xl border-2 border-gray-900 bg-white hover:shadow-[4px_4px_0px_#16a34a] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
                            >
                                <Home size={16} />
                                Go home
                            </Link>
                        </div>
                    </div>

                    {/* Helper text below card */}
                    <p className="mt-6 sm:mt-8 text-sm sm:text-base text-gray-400 font-bold">
                        Think this is an error?{" "}
                        <a
                            href="#"
                            className="text-green-600 hover:text-green-700 underline decoration-2 underline-offset-2 decoration-green-600/30 hover:decoration-green-600 transition-colors"
                        >
                            Let us know
                        </a>
                    </p>
                </motion.div>

                {/* Bottom decorative strip */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-900" />
            </div>
        );
    }

    return <CourseShell course={course} joined={joined} />;
}