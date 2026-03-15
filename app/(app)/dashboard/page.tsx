"use client";

import { useState, useMemo, useEffect } from "react";
import {
    Search,
    TrendingUp,
    Users,
    Star,
    SlidersHorizontal,
    ArrowUpRight,
    X,
    Zap,
    BookOpen,
    GraduationCap,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { allCourses } from "@/lib/data";
import PageShell from "@/components/shared/PageShell";

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

function HandDrawnUnderline({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 200 12"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden
        >
            <motion.path
                d="M2 8C20 2 40 12 60 6C80 0 100 12 120 6C140 0 160 12 180 6C190 3 196 7 198 5"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
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

/* ─── Main page ─── */

export default function DashboardPage() {
    const [departmentFilter, setDepartmentFilter] = useState("all");
    const [yearFilter, setYearFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("popularity");
    const [showFilters, setShowFilters] = useState(false);

    const { profile } = useAuth();
    const greeting = profile?.username || (profile?.first_name as string | null | undefined) || "there";

    const departments = useMemo(() => {
        const deps = new Set(allCourses.map((c) => c.department));
        return Array.from(deps).sort();
    }, []);

    const filtered = useMemo(() => {
        let courses = [...allCourses];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            courses = courses.filter(
                (c) =>
                    c.name.toLowerCase().includes(q) ||
                    c.code.toLowerCase().includes(q) ||
                    c.professor.toLowerCase().includes(q)
            );
        }

        if (departmentFilter !== "all") {
            courses = courses.filter(
                (c) =>
                    c.department.toLowerCase() ===
                    departmentFilter.toLowerCase()
            );
        }

        if (yearFilter !== "all") {
            courses = courses.filter(
                (c) => c.year === parseInt(yearFilter, 10)
            );
        }

        return courses.sort((a, b) => {
            switch (sortBy) {
                case "popularity":
                    return b.popularity - a.popularity;
                case "difficulty":
                    return a.difficulty - b.difficulty;
                case "students":
                    return b.currentStudents - a.currentStudents;
                default:
                    return 0;
            }
        });
    }, [searchQuery, departmentFilter, yearFilter, sortBy]);

    const activeFilterCount =
        (departmentFilter !== "all" ? 1 : 0) +
        (yearFilter !== "all" ? 1 : 0) +
        (sortBy !== "popularity" ? 1 : 0);

    const totalStudents = allCourses.reduce(
        (acc, c) => acc + c.currentStudents,
        0
    );

    const avgPopularity = Math.round(
        allCourses.reduce((acc, c) => acc + c.popularity, 0) /
        allCourses.length
    );

    const resetAll = () => {
        setDepartmentFilter("all");
        setYearFilter("all");
        setSortBy("popularity");
        setSearchQuery("");
    };

    const selectClass =
        "w-full px-4 py-3 bg-white border-2 border-gray-900 rounded-xl text-base text-gray-900 font-medium focus:outline-none focus-visible:ring-4 focus-visible:ring-green-600/20 focus-visible:border-green-600 cursor-pointer transition-all";

    const isFiltersActive = showFilters || activeFilterCount > 0;

    const filterBtnClass = isFiltersActive
        ? "inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:py-4 rounded-xl text-base font-bold transition-all border-2 bg-gray-900 text-white border-gray-900 shadow-[3px_3px_0px_#16a34a]"
        : "inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:py-4 rounded-xl text-base font-bold transition-all border-2 bg-white text-gray-900 border-gray-900 hover:shadow-[3px_3px_0px_#16a34a]";

    return (
        <PageShell>
            <main className="min-h-screen pt-16 lg:pt-20">
                {/* ════════════════════════════════════════
                    HERO SECTION
                   ════════════════════════════════════════ */}
                <section className="relative overflow-hidden bg-green-50 border-b-[3px] border-gray-900">
                    <DotGrid className="opacity-[0.18]" />

                    <DoodleStar className="absolute top-8 right-6 sm:right-16 w-7 h-7 sm:w-9 sm:h-9 text-green-600/50 rotate-12" />
                    <DoodleStar className="absolute bottom-10 right-[30%] w-5 h-5 text-green-600/30 -rotate-6 hidden sm:block" />
                    <DoodleCircle className="absolute top-10 right-28 sm:right-44 w-10 h-10 sm:w-12 sm:h-12 text-green-600/25 hidden sm:block" />
                    <DoodleZigzag className="absolute bottom-6 right-8 sm:right-16 w-16 sm:w-20 text-green-600/25 hidden lg:block" />
                    <DoodleCross className="absolute top-20 left-[55%] w-5 h-5 text-green-600/20 hidden md:block" />
                    <DoodleArrow className="absolute bottom-14 left-6 sm:left-16 w-14 sm:w-16 text-green-600/30 rotate-6 hidden sm:block" />
                    <DoodleSpring className="absolute top-6 right-[22%] w-5 h-auto text-green-600/20 hidden xl:block" />

                    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                                className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border-2 border-gray-900 rounded-full mb-6 shadow-[3px_3px_0px_#16a34a]"
                            >
                                <span className="text-lg sm:text-xl">👋</span>
                                <span className="text-sm sm:text-base font-bold text-gray-900">
                                    Hey {greeting}!
                                </span>
                                <Link
                                    href="#"
                                    className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-green-600 hover:text-green-700 ml-1 transition-colors"
                                >
                                    Invite friends
                                    <ArrowUpRight size={13} />
                                </Link>
                            </motion.div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-gray-900 leading-[1.05]">
                                Discover{" "}
                                <span className="relative inline-block">
                                    Courses
                                    <HandDrawnUnderline className="absolute -bottom-1.5 sm:-bottom-2 left-0 w-full h-2.5 sm:h-3.5 text-green-600" />
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mt-5 max-w-2xl font-medium leading-relaxed">
                                Browse course rooms and join the ones that match
                                your semester. Find your people, share notes,
                                and ace it together.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.5 }}
                            className="flex flex-wrap gap-2.5 sm:gap-3 mt-8 sm:mt-10"
                        >
                            {[
                                {
                                    icon: BookOpen,
                                    value: allCourses.length,
                                    label: "Courses",
                                },
                                {
                                    icon: Users,
                                    value: totalStudents.toLocaleString(),
                                    label: "Students",
                                },
                                {
                                    icon: GraduationCap,
                                    value: departments.length,
                                    label: "Depts",
                                },
                                {
                                    icon: Zap,
                                    value: `${avgPopularity}%`,
                                    label: "Avg pop.",
                                },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-gray-900 rounded-xl text-sm sm:text-base"
                                >
                                    <stat.icon
                                        size={16}
                                        className="text-green-600 flex-shrink-0"
                                    />
                                    <span className="font-black text-gray-900">
                                        {stat.value}
                                    </span>
                                    <span className="text-gray-500 font-medium hidden sm:inline">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ════════════════════════════════════════
                    SEARCH & FILTERS
                   ════════════════════════════════════════ */}
                <section className="sticky top-16 lg:top-20 z-30 bg-white/85 backdrop-blur-2xl border-b-[3px] border-gray-900">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className="flex flex-col sm:flex-row gap-3"
                        >
                            <div className="relative flex-1">
                                <Search
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <input
                                    type="text"
                                    placeholder="Search courses, professors, codes…"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-12 pr-10 py-3.5 sm:py-4 bg-gray-50 border-2 border-gray-900 rounded-xl text-base sm:text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-600/20 focus-visible:border-green-600 transition-all font-medium"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-900 rounded-lg transition-colors"
                                        aria-label="Clear search"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={filterBtnClass}
                            >
                                <SlidersHorizontal size={18} />
                                Filters
                                {activeFilterCount > 0 && (
                                    <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-black">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </motion.div>

                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{
                                        duration: 0.25,
                                        ease: "easeOut",
                                    }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5 mt-5 border-t-2 border-dashed border-gray-300">
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                                                Department
                                            </label>
                                            <select
                                                value={departmentFilter}
                                                onChange={(e) =>
                                                    setDepartmentFilter(
                                                        e.target.value
                                                    )
                                                }
                                                className={selectClass}
                                            >
                                                <option value="all">
                                                    All departments
                                                </option>
                                                {departments.map((d) => (
                                                    <option key={d} value={d}>
                                                        {d}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                                                Year
                                            </label>
                                            <select
                                                value={yearFilter}
                                                onChange={(e) =>
                                                    setYearFilter(
                                                        e.target.value
                                                    )
                                                }
                                                className={selectClass}
                                            >
                                                <option value="all">
                                                    All years
                                                </option>
                                                <option value="1">
                                                    1st Year
                                                </option>
                                                <option value="2">
                                                    2nd Year
                                                </option>
                                                <option value="3">
                                                    3rd Year
                                                </option>
                                                <option value="4">
                                                    4th Year
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                                                Sort by
                                            </label>
                                            <select
                                                value={sortBy}
                                                onChange={(e) =>
                                                    setSortBy(e.target.value)
                                                }
                                                className={selectClass}
                                            >
                                                <option value="popularity">
                                                    Most Popular
                                                </option>
                                                <option value="difficulty">
                                                    Easiest First
                                                </option>
                                                <option value="students">
                                                    Most Students
                                                </option>
                                            </select>
                                        </div>

                                        <div className="flex items-end">
                                            <button
                                                onClick={resetAll}
                                                className="w-full px-4 py-3 text-base text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all font-bold rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-900"
                                            >
                                                Reset all
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                {/* ════════════════════════════════════════
                    COURSE GRID
                   ════════════════════════════════════════ */}
                <section className="relative bg-white">
                    <DotGrid className="opacity-[0.06]" />

                    <DoodleStar className="absolute top-8 right-8 w-6 h-6 text-green-600/15 rotate-45 hidden lg:block" />
                    <DoodleCross className="absolute top-40 left-6 w-4 h-4 text-green-600/15 rotate-12 hidden lg:block" />
                    <DoodleCircle className="absolute bottom-20 right-12 w-10 h-10 text-green-600/10 hidden lg:block" />

                    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
                        <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
                            <p className="text-sm sm:text-base font-black text-gray-400 uppercase tracking-widest">
                                {filtered.length} course
                                {filtered.length !== 1 ? "s" : ""} found
                            </p>

                            {departmentFilter !== "all" && (
                                <button
                                    onClick={() => setDepartmentFilter("all")}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border-2 border-green-600 rounded-lg text-sm font-bold text-green-700 hover:bg-green-100 transition-colors"
                                >
                                    {departmentFilter}
                                    <X size={13} />
                                </button>
                            )}
                            {yearFilter !== "all" && (
                                <button
                                    onClick={() => setYearFilter("all")}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border-2 border-green-600 rounded-lg text-sm font-bold text-green-700 hover:bg-green-100 transition-colors"
                                >
                                    Year {yearFilter}
                                    <X size={13} />
                                </button>
                            )}
                            {sortBy !== "popularity" && (
                                <button
                                    onClick={() => setSortBy("popularity")}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border-2 border-green-600 rounded-lg text-sm font-bold text-green-700 hover:bg-green-100 transition-colors"
                                >
                                    {sortBy === "difficulty"
                                        ? "Easiest"
                                        : "Most Students"}
                                    <X size={13} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                            {filtered.map((course, i) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: Math.min(i * 0.04, 0.4),
                                        duration: 0.45,
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                    }}
                                >
                                    <Link
                                        href={`/rooms/${course.id}/chat`}
                                        className="group relative block p-5 sm:p-6 rounded-xl border-2 border-gray-900 bg-white transition-all duration-200 hover:shadow-[5px_5px_0px_#16a34a] hover:-translate-x-[2px] hover:-translate-y-[2px] active:shadow-[2px_2px_0px_#16a34a] active:translate-x-0 active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-600/30"
                                    >
                                        <div className="flex items-center justify-between gap-3 mb-4">
                                            <span className="px-3 py-1.5 text-xs font-black bg-gray-900 text-white rounded-lg uppercase tracking-wider">
                                                {course.department}
                                            </span>
                                            <span className="text-sm sm:text-base text-gray-400 font-bold">
                                                Yr {course.year}
                                            </span>
                                        </div>

                                        <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2 tracking-tight leading-snug group-hover:text-green-700 transition-colors">
                                            {course.name}
                                        </h3>

                                        <p className="text-sm sm:text-base text-gray-500 mb-5 font-medium">
                                            {course.code} &middot; Prof.{" "}
                                            {course.professor}
                                        </p>

                                        <div className="border-t-2 border-dashed border-gray-200 mb-4" />

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-400">
                                                <span className="flex items-center gap-1.5 font-bold">
                                                    <Users
                                                        size={15}
                                                        className="text-green-600"
                                                    />
                                                    {course.currentStudents}
                                                </span>
                                                <span className="flex items-center gap-1.5 font-bold">
                                                    <Star
                                                        size={15}
                                                        className="text-green-600"
                                                    />
                                                    {course.difficulty}/5
                                                </span>
                                                <span className="flex items-center gap-1.5 font-bold">
                                                    <TrendingUp
                                                        size={15}
                                                        className="text-green-600"
                                                    />
                                                    {course.popularity}%
                                                </span>
                                            </div>

                                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-2 border-gray-900 flex items-center justify-center group-hover:bg-green-600 group-hover:border-green-600 transition-all">
                                                <ArrowUpRight
                                                    size={16}
                                                    className="text-gray-900 group-hover:text-white transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20 sm:py-28"
                            >
                                <div className="relative inline-block mb-6">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-50 border-2 border-gray-900 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#16a34a]">
                                        <Search
                                            size={32}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <DoodleStar className="absolute -top-3 -right-3 w-6 h-6 text-green-600/40 rotate-12" />
                                </div>
                                <p className="text-gray-900 text-xl sm:text-2xl font-black mb-2">
                                    No courses found
                                </p>
                                <p className="text-gray-500 text-base sm:text-lg font-medium mb-6 max-w-md mx-auto">
                                    Try adjusting your search or filters to find
                                    what you&apos;re looking for
                                </p>
                                <button
                                    onClick={resetAll}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-base font-bold rounded-xl border-2 border-gray-900 hover:shadow-[4px_4px_0px_#16a34a] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
                                >
                                    Clear all filters
                                    <X size={16} />
                                </button>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* ════════════════════════════════════════
                    BOTTOM CTA STRIP
                   ════════════════════════════════════════ */}
                <section className="relative overflow-hidden bg-gray-900 border-t-[3px] border-gray-900">
                    <DoodleZigzag className="absolute top-4 left-8 w-16 text-green-600/20 hidden sm:block" />
                    <DoodleStar className="absolute bottom-4 right-10 w-6 h-6 text-green-600/20 rotate-45 hidden sm:block" />
                    <DoodleCircle className="absolute top-3 right-32 w-8 h-8 text-green-600/15 hidden lg:block" />

                    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                        <div>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                                Can&apos;t find your course?
                            </h2>
                            <p className="text-base sm:text-lg text-gray-400 font-medium mt-2">
                                Request a new course room and we&apos;ll set it
                                up for you.
                            </p>
                        </div>
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2.5 px-7 py-4 bg-green-600 text-white text-base sm:text-lg font-bold rounded-xl border-2 border-green-600 hover:bg-green-700 hover:border-green-700 active:scale-[0.97] transition-all shadow-[4px_4px_0px_rgba(255,255,255,0.15)] flex-shrink-0"
                        >
                            Request a course
                            <ArrowUpRight size={18} />
                        </Link>
                    </div>
                </section>
            </main>
        </PageShell>
    );
}
