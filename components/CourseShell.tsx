"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
    MessageSquare,
    BarChart3,
    GraduationCap,
    FileText,
    Users,
    Send,
    BookOpen,
    Plus,
    Bell,
    X,
    Star,
    Download,
    Link2,
    Paperclip,
    ChevronLeft,
    Settings,
    ArrowUpRight,
    Sparkles,
    Zap,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { CourseWithDepartment } from "@/queries/schools";
import { useMessages } from "@/hooks/use-messages";
import { fetchReviewsAction } from "@/app/(app)/professors/actions";
import {
    useResources,
    isUrl,
    isValidFile,
    formatBytes,
    getFileEmoji,
    ACCEPTED_FILE_TYPES,
} from "@/hooks/use-resources";

/* ─── Decorative elements ─── */

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

function DotGrid({ className }: { className?: string }) {
    return (
        <div
            className={`absolute inset-0 pointer-events-none ${className || ""}`}
            aria-hidden
            style={{
                backgroundImage:
                    "radial-gradient(circle, #9ca3af 1px, transparent 1px)",
                backgroundSize: "24px 24px",
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
                backgroundSize: "40px 40px",
            }}
        />
    );
}

/* ─── Types ─── */

type Props = { course: CourseWithDepartment | null; slug: string; joined: boolean; roomId?: number };
type Tab =
    | "discussion"
    | "course-intel"
    | "mentorship"
    | "resources"
    | "sessions";

const tabs: { id: Tab; label: string; icon: any; emoji: string }[] = [
    { id: "discussion", label: "Discussion", icon: MessageSquare, emoji: "💬" },
    { id: "course-intel", label: "Intel", icon: BarChart3, emoji: "📊" },
    { id: "mentorship", label: "Mentors", icon: GraduationCap, emoji: "🎓" },
    { id: "resources", label: "Resources", icon: FileText, emoji: "📁" },
    { id: "sessions", label: "Sessions", icon: Users, emoji: "📅" },
];

const onlineUsers = [
    { id: 1, name: "Sarah Chen", initials: "SC", status: "online" as const },
    { id: 2, name: "Alex Kim", initials: "AK", status: "online" as const },
    { id: 3, name: "Dr. Mike R.", initials: "MR", status: "online" as const },
    { id: 4, name: "Emma Wilson", initials: "EW", status: "away" as const },
];

/* ═══════════════════════════════════
   MAIN COURSE SHELL
═══════════════════════════════════ */

export default function CourseShell({ course, slug, joined, roomId: roomIdProp }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("discussion");
    const [composer, setComposer] = useState("");
    const [hasJoined, setHasJoined] = useState(joined);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebar, setMobileSidebar] = useState(false);

    const { user, profile } = useAuth();
    const roomId = roomIdProp ?? 1;
    const { messages, sendMessage } = useMessages(roomId);

    const currentUserLabel = profile?.username ?? user?.email?.split("@")[0] ?? "You";

    const handleSend = () => {
        if (!composer.trim()) return;
        sendMessage(composer.trim(), user?.id ?? null);
        setComposer("");
    };

    return (
        <div className="h-screen bg-white flex overflow-hidden">
            {/* ═══ Mobile sidebar overlay ═══ */}
            <AnimatePresence>
                {mobileSidebar && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                        onClick={() => setMobileSidebar(false)}
                    />
                )}
            </AnimatePresence>

            {/* ═══ Sidebar ═══ */}
            <motion.aside
                animate={{
                    width: sidebarCollapsed ? 72 : 280,
                    x: 0,
                }}
                transition={{
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className={`border-r-[3px] border-gray-900 flex flex-col bg-white relative overflow-hidden flex-shrink-0 z-50 ${
                    mobileSidebar
                        ? "fixed inset-y-0 left-0 shadow-[6px_0px_0px_#16a34a]"
                        : "hidden lg:flex"
                }`}
            >
                {/* Back + Brand */}
                <div className="p-4 sm:p-5 border-b-2 border-dashed border-gray-200">
                    {!sidebarCollapsed && (
                        <Link
                            href="/dashboard"
                            className="group inline-flex items-center gap-1.5 text-gray-400 hover:text-green-600 mb-4 transition-colors text-sm font-bold"
                        >
                            <ChevronLeft
                                size={16}
                                strokeWidth={2.5}
                                className="group-hover:-translate-x-0.5 transition-transform"
                            />
                            Discover
                        </Link>
                    )}

                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="flex items-center gap-2.5 group"
                        >
                            <div className="w-9 h-9 bg-gray-900 rounded-lg border-2 border-gray-900 flex items-center justify-center group-hover:bg-green-600 group-hover:shadow-[2px_2px_0px_#111827] group-hover:-translate-x-[1px] group-hover:-translate-y-[1px] transition-all duration-200 flex-shrink-0">
                                <span className="text-white font-black text-sm">
                                    K
                                </span>
                            </div>
                            {!sidebarCollapsed && (
                                <span className="text-base font-black tracking-tight text-gray-900">
                                    kampus
                                </span>
                            )}
                        </Link>
                        {mobileSidebar && (
                            <button
                                onClick={() => setMobileSidebar(false)}
                                className="p-2 text-gray-400 hover:text-gray-900 rounded-lg lg:hidden"
                            >
                                <X size={18} strokeWidth={2.5} />
                            </button>
                        )}
                    </div>
                </div>

                {!sidebarCollapsed && (
                    <>
                        {/* Course Info */}
                        <div className="p-4 sm:p-5 border-b-2 border-dashed border-gray-200">
                            {course?.department_name && (
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                    {course.department_name}
                                </span>
                            )}
                            <h2 className="text-xl font-black text-gray-900 mt-2 tracking-tight">
                                {course?.course_code ?? slug}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed font-medium">
                                {course?.name ?? slug}
                            </p>
                        </div>

                        {/* Community */}
                        <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
                            {/* Online users */}
                            <div className="mt-6">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                    Online now
                                </span>
                                <div className="mt-3 space-y-1.5">
                                    {onlineUsers.map((u) => (
                                        <div
                                            key={u.id}
                                            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
                                        >
                                            <div className="relative">
                                                <div className="w-7 h-7 bg-gray-100 border-2 border-gray-900 rounded-lg flex items-center justify-center text-[9px] font-black text-gray-600">
                                                    {u.initials}
                                                </div>
                                                <span
                                                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                                        u.status === "online"
                                                            ? "bg-green-500"
                                                            : "bg-yellow-500"
                                                    }`}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-600 font-bold truncate">
                                                {u.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Collapse toggle */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-4 sm:p-5 border-t-2 border-dashed border-gray-200 text-gray-400 hover:text-gray-900 hover:bg-green-50 transition-all flex items-center gap-3 text-sm font-bold"
                >
                    <Settings size={16} strokeWidth={2.5} />
                    {!sidebarCollapsed && "Settings"}
                </button>
            </motion.aside>

            {/* ═══ Main Content ═══ */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                {/* Header */}
                <header className="h-14 sm:h-16 border-b-[3px] border-gray-900 flex items-center justify-between px-3 sm:px-5 lg:px-6 bg-white/90 backdrop-blur-2xl sticky top-0 z-20">
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileSidebar(true)}
                        className="lg:hidden p-2 -ml-1 mr-2 text-gray-900 hover:bg-gray-100 rounded-lg border-2 border-transparent hover:border-gray-900 transition-all"
                        aria-label="Open sidebar"
                    >
                        <BookOpen size={18} strokeWidth={2.5} />
                    </button>

                    <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1 flex-1">
                        {tabs.map((t) => {
                            const isActive = activeTab === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id)}
                                    className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap border-2 ${
                                        isActive
                                            ? "bg-green-600 text-white border-green-600 shadow-[2px_2px_0px_#111827]"
                                            : "text-gray-400 hover:text-gray-900 border-transparent hover:border-gray-900 hover:bg-gray-50"
                                    }`}
                                >
                                    <t.icon size={14} />
                                    <span className="hidden sm:inline">
                                        {t.label}
                                    </span>
                                    <span className="sm:hidden">
                                        {t.emoji}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                        {!hasJoined ? (
                            <button
                                onClick={() => setHasJoined(true)}
                                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-green-600 text-white text-sm font-bold rounded-lg border-2 border-green-600 hover:bg-green-700 hover:border-green-700 transition-all active:scale-[0.97] shadow-[3px_3px_0px_#111827]"
                            >
                                <span className="hidden sm:inline">
                                    Join Room
                                </span>
                                <span className="sm:hidden">Join</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg border-2 border-transparent hover:border-green-600 transition-all">
                                    <Bell size={16} />
                                </button>
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-green-600 border-2 border-gray-900 flex items-center justify-center text-xs font-black text-white">
                                    {currentUserLabel.slice(0, 2).toUpperCase()}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-green-50/50 relative">
                    <DotGrid className="opacity-[0.06]" />

                    <AnimatePresence mode="wait">
                        {activeTab === "discussion" && (
                            <motion.div
                                key="discussion"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full relative"
                            >
                                <DiscussionTab
                                    messages={messages}
                                    currentUserId={user?.id ?? null}
                                    composer={composer}
                                    setComposer={setComposer}
                                    onSend={handleSend}
                                    hasJoined={hasJoined}
                                    setHasJoined={setHasJoined}
                                />
                            </motion.div>
                        )}
                        {activeTab === "course-intel" && (
                            <motion.div
                                key="intel"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative"
                            >
                                <CourseIntelTab course={course} roomId={roomId} />
                            </motion.div>
                        )}
                        {activeTab === "mentorship" && (
                            <motion.div
                                key="mentorship"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative"
                            >
                                <MentorshipTab />
                            </motion.div>
                        )}
                        {activeTab === "resources" && (
                            <motion.div
                                key="resources"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative"
                            >
                                <ResourcesTab roomId={roomId} currentUserId={user?.id ?? null} />
                            </motion.div>
                        )}
                        {activeTab === "sessions" && (
                            <motion.div
                                key="sessions"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative"
                            >
                                <SessionsTab />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

        </div>
    );
}

/* ═══════════════════════════════════
   DISCUSSION TAB
═══════════════════════════════════ */
function DiscussionTab({
    messages,
    currentUserId,
    composer,
    setComposer,
    onSend,
    hasJoined,
    setHasJoined,
}: any) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!hasJoined) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 sm:p-8 text-center relative">
                <DoodleStar className="absolute top-10 right-10 w-7 h-7 text-green-600/20 rotate-12 hidden sm:block" />
                <DoodleCircle className="absolute bottom-16 left-12 w-10 h-10 text-green-600/15 hidden sm:block" />
                <DoodleCross className="absolute top-20 left-[20%] w-4 h-4 text-green-600/15 hidden md:block" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full"
                >
                    <div className="bg-white border-2 border-gray-900 rounded-xl p-7 sm:p-10 shadow-[6px_6px_0px_#16a34a]">
                        <div className="relative inline-block mb-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 border-2 border-gray-900 rounded-xl flex items-center justify-center shadow-[3px_3px_0px_#16a34a]">
                                <Sparkles className="text-green-600" size={28} />
                            </div>
                            <DoodleStar className="absolute -top-2 -right-2 w-5 h-5 text-green-600/50 rotate-12" />
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-3">
                            Unlock the full room
                        </h3>
                        <p className="text-gray-500 text-base font-medium leading-relaxed mb-8">
                            Join this course room to see all messages, share
                            resources, and connect with alumni mentors.
                        </p>

                        <div className="border-t-2 border-dashed border-gray-200 mb-8" />

                        <div className="space-y-3 w-full">
                            <button
                                onClick={() => setHasJoined(true)}
                                className="w-full px-7 py-4 bg-green-600 hover:bg-green-700 text-white text-base font-bold rounded-xl border-2 border-green-600 hover:border-green-700 transition-all active:scale-[0.97] shadow-[4px_4px_0px_#111827]"
                            >
                                Join Course Room
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full relative">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 relative">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-16">
                        <div className="w-14 h-14 bg-green-50 border-2 border-gray-900 rounded-xl flex items-center justify-center mb-4 shadow-[3px_3px_0px_#16a34a]">
                            <MessageSquare size={22} className="text-green-600" />
                        </div>
                        <p className="text-base font-black text-gray-900 mb-1">No messages yet</p>
                        <p className="text-sm text-gray-400 font-medium">Be the first to start the conversation.</p>
                    </div>
                )}
                {messages.map((msg: any, i: number) => {
                    const isOwn = msg.author_id === currentUserId;
                    const label = isOwn ? "You" : "Member";
                    const initials = label.slice(0, 2).toUpperCase();
                    const timestamp = new Date(msg.created_at ?? "").toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                    });
                    return (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(i * 0.04, 0.3), duration: 0.3 }}
                            className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                        >
                            <div className="w-9 h-9 bg-gray-100 border-2 border-gray-900 rounded-lg flex items-center justify-center text-xs font-black text-gray-600 flex-shrink-0">
                                {initials}
                            </div>
                            <div className={`flex flex-col max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-black text-gray-500">{label}</span>
                                    <span className="text-[10px] text-gray-300 font-bold">{timestamp}</span>
                                </div>
                                <div className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 ${
                                    isOwn
                                        ? "bg-green-600 text-white border-green-700 rounded-tr-sm"
                                        : "bg-white text-gray-900 border-gray-900 rounded-tl-sm shadow-[2px_2px_0px_#16a34a]"
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Composer */}
            <div className="px-4 sm:px-6 py-4 border-t-[3px] border-gray-900 bg-white">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={composer}
                            onChange={(e) => setComposer(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onSend()}
                            placeholder="Share insights, ask questions…"
                            className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 rounded-xl border-2 border-gray-900 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-600/20 focus-visible:border-green-600 transition-all pr-10 font-medium"
                        />
                    </div>
                    <button
                        onClick={onSend}
                        className="px-4 sm:px-5 py-3 sm:py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-base font-bold transition-all flex items-center gap-2 active:scale-[0.97] border-2 border-green-600 hover:border-green-700 shadow-[3px_3px_0px_#111827]"
                    >
                        <Send size={16} />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════
   COURSE INTEL TAB
═══════════════════════════════════ */
function CourseIntelTab({ course, roomId }: { course: CourseWithDepartment | null; roomId: number }) {
    const { messages: roomMessages } = useMessages(roomId);
    const [reviews, setReviews] = useState<{ rating: number; comment: string | null }[]>([]);

    useEffect(() => {
        fetchReviewsAction().then(setReviews);
    }, []);

    const metrics = [
        {
            icon: MessageSquare,
            value: roomMessages.length.toString(),
            label: "Posts",
            sub: "Room discussions",
            color: "bg-purple-50",
            iconColor: "text-purple-600",
            borderColor: "border-purple-300",
        },
        {
            icon: Star,
            value: reviews.length.toString(),
            label: "Reviews",
            sub: "From students",
            color: "bg-yellow-50",
            iconColor: "text-yellow-600",
            borderColor: "border-yellow-400",
        },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-gray-900 rounded-full text-xs font-black text-gray-900 uppercase tracking-widest mb-4 shadow-[2px_2px_0px_#16a34a]">
                    📊 Course Intel
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    Course <span className="text-green-600">insights</span>
                </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {metrics.map((m, i) => {
                    const Icon = m.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            className="p-4 sm:p-5 rounded-xl bg-white border-2 border-gray-900 hover:shadow-[4px_4px_0px_#16a34a] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all duration-200"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-2xl sm:text-3xl font-black text-gray-900 tabular-nums tracking-tight">
                                        {m.value}
                                    </p>
                                    <p className="text-sm font-bold text-gray-500 mt-1">
                                        {m.label}
                                    </p>
                                </div>
                                <div
                                    className={`p-2 sm:p-2.5 ${m.color} rounded-lg border-2 ${m.borderColor}`}
                                >
                                    <Icon size={18} className={m.iconColor} />
                                </div>
                            </div>
                            <div className="border-t-2 border-dashed border-gray-200 pt-2 mt-2">
                                <p className="text-xs text-gray-400 font-bold">
                                    {m.sub}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="mt-4 sm:mt-6 p-5 sm:p-7 rounded-xl bg-white border-2 border-gray-900 shadow-[4px_4px_0px_#16a34a]"
                >
                    <h3 className="font-black text-gray-900 text-base sm:text-lg mb-5 flex items-center gap-2">
                        💡 What people say
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                        {reviews.filter((r) => r.comment).slice(0, 5).map((r, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="flex items-start gap-3 text-sm sm:text-base text-gray-600 font-medium p-3 sm:p-4 bg-green-50 rounded-lg border-2 border-green-600/30"
                            >
                                <span className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-black text-white">
                                    {r.rating}★
                                </span>
                                {r.comment}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Grade distribution placeholder */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mt-4 sm:mt-6 p-5 sm:p-7 rounded-xl bg-gray-900 border-2 border-gray-900 text-white relative overflow-hidden"
            >
                <GridPattern className="text-white/[0.04]" />
                <div className="relative">
                    <h3 className="font-black text-base sm:text-lg mb-2 flex items-center gap-2">
                        📈 Grade Distribution
                    </h3>
                    <p className="text-white/50 text-sm font-medium mb-6">
                        Based on the last 3 semesters
                    </p>
                    <div className="flex items-end gap-2 h-24 sm:h-32">
                        {[
                            { grade: "A", pct: 28 },
                            { grade: "A-", pct: 22 },
                            { grade: "B+", pct: 20 },
                            { grade: "B", pct: 15 },
                            { grade: "B-", pct: 8 },
                            { grade: "C+", pct: 5 },
                            { grade: "C", pct: 2 },
                        ].map((g, i) => (
                            <motion.div
                                key={g.grade}
                                initial={{ height: 0 }}
                                animate={{
                                    height: `${g.pct * (100 / 28)}%`,
                                }}
                                transition={{
                                    delay: 0.7 + i * 0.08,
                                    duration: 0.5,
                                    ease: "easeOut",
                                }}
                                className="flex-1 flex flex-col items-center gap-1"
                            >
                                <span className="text-[10px] sm:text-xs font-black text-white/70">
                                    {g.pct}%
                                </span>
                                <div
                                    className="w-full bg-green-600 rounded-t-md border-2 border-green-500 flex-1 min-h-[4px]"
                                />
                                <span className="text-[10px] sm:text-xs font-bold text-white/40 mt-1">
                                    {g.grade}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

/* ═══════════════════════════════════
   MENTORSHIP TAB
═══════════════════════════════════ */
function MentorshipTab() {
    const mentors = [
        {
            name: "Dr. Mike R.",
            year: "Class of '22",
            specialty: "Data Structures",
            rating: 4.9,
            sessions: 23,
            initials: "MR",
        },
        {
            name: "Sarah Chen",
            year: "Class of '23",
            specialty: "Algorithms",
            rating: 4.8,
            sessions: 15,
            initials: "SC",
        },
        {
            name: "Alex Kim",
            year: "Class of '24",
            specialty: "Study Strategies",
            rating: 4.7,
            sessions: 8,
            initials: "AK",
        },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-gray-900 rounded-full text-xs font-black text-gray-900 uppercase tracking-widest mb-4 shadow-[2px_2px_0px_#16a34a]">
                    🎓 Mentors
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    Connect with grads who&apos;ve{" "}
                    <span className="text-green-600">mastered</span> this course
                </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {mentors.map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        className="p-5 sm:p-6 rounded-xl bg-white border-2 border-gray-900 hover:shadow-[5px_5px_0px_#16a34a] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-200 group"
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-12 h-12 rounded-lg bg-gray-900 border-2 border-gray-900 flex items-center justify-center text-sm font-black text-green-500">
                                {m.initials}
                            </div>
                            <div>
                                <p className="font-black text-gray-900 text-base">
                                    {m.name}
                                </p>
                                <p className="text-xs text-gray-400 font-bold">
                                    {m.year}
                                </p>
                            </div>
                        </div>

                        <div className="border-t-2 border-dashed border-gray-200 pt-4 space-y-3 mb-5">
                            {[
                                {
                                    label: "Specialty",
                                    value: m.specialty,
                                },
                                {
                                    label: "Rating",
                                    value: `⭐ ${m.rating}`,
                                },
                                {
                                    label: "Sessions",
                                    value: `${m.sessions} completed`,
                                },
                            ].map((row) => (
                                <div
                                    key={row.label}
                                    className="flex justify-between text-sm"
                                >
                                    <span className="text-gray-400 font-bold">
                                        {row.label}
                                    </span>
                                    <span className="font-bold text-gray-700">
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button className="w-full px-4 py-3 bg-white text-gray-900 text-sm font-bold rounded-lg border-2 border-gray-900 hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-[3px_3px_0px_#111827] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all">
                            Request Mentor
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* CTA card */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-4 sm:mt-6 p-5 sm:p-7 rounded-xl bg-green-600 border-2 border-gray-900 shadow-[4px_4px_0px_#111827] flex flex-col sm:flex-row items-center justify-between gap-4"
            >
                <div>
                    <h3 className="text-lg sm:text-xl font-black text-white mb-1">
                        Want to become a mentor?
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base font-medium">
                        Help future students succeed in this course
                    </p>
                </div>
                <button className="px-6 py-3 bg-white text-gray-900 font-bold text-sm rounded-lg border-2 border-gray-900 hover:shadow-[3px_3px_0px_#111827] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all flex-shrink-0 flex items-center gap-2">
                    Apply now
                    <ArrowUpRight size={14} />
                </button>
            </motion.div>
        </div>
    );
}

/* ═══════════════════════════════════
   RESOURCES TAB
═══════════════════════════════════ */
function ResourcesTab({ roomId, currentUserId }: { roomId: number; currentUserId: string | null }) {
    const { resources, uploading, uploadError, postLink, uploadFile } = useResources(roomId);
    const [linkInput, setLinkInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePostLink = () => {
        if (!linkInput.trim()) return;
        postLink(linkInput.trim(), currentUserId);
        setLinkInput("");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!isValidFile(file)) {
            alert("Unsupported file type. Accepted: PDF, TXT, JSON, DOC, DOCX, MD");
            return;
        }
        uploadFile(file, currentUserId);
        e.target.value = "";
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-gray-900 rounded-full text-xs font-black text-gray-900 uppercase tracking-widest mb-4 shadow-[2px_2px_0px_#16a34a]">
                    📁 Resources
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    Community-shared materials
                </h2>
            </div>

            {/* Composer */}
            <div className="mb-6 bg-white border-2 border-gray-900 rounded-xl p-4 shadow-[4px_4px_0px_#16a34a] space-y-3">
                {/* Link input */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="url"
                            value={linkInput}
                            onChange={(e) => setLinkInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handlePostLink()}
                            placeholder="Paste a link (Notion, YouTube, GitHub…)"
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 rounded-lg border-2 border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-600 transition-all font-medium"
                        />
                    </div>
                    <button
                        onClick={handlePostLink}
                        disabled={!isUrl(linkInput)}
                        className="px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg border-2 border-green-600 hover:border-green-700 transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_#111827] active:scale-[0.97]"
                    >
                        <ArrowUpRight size={15} />
                        Share
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 border-t-2 border-dashed border-gray-200" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">or</span>
                    <div className="flex-1 border-t-2 border-dashed border-gray-200" />
                </div>

                {/* File upload */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_FILE_TYPES}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-green-50 border-2 border-dashed border-gray-300 hover:border-green-600 rounded-lg text-sm font-bold text-gray-500 hover:text-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {uploading ? (
                        <><Loader2 size={15} className="animate-spin" /> Uploading…</>
                    ) : (
                        <><Paperclip size={15} /> Upload file <span className="text-gray-400 font-medium">(PDF, TXT, JSON, DOC, MD)</span></>
                    )}
                </button>
                {uploadError && (
                    <p className="text-xs text-red-600 font-bold bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        ⚠ {uploadError}
                    </p>
                )}
            </div>

            {/* List */}
            {resources.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-14 h-14 bg-green-50 border-2 border-gray-900 rounded-xl flex items-center justify-center mb-4 shadow-[3px_3px_0px_#16a34a]">
                        <FileText size={22} className="text-green-600" />
                    </div>
                    <p className="text-base font-black text-gray-900 mb-1">No resources yet</p>
                    <p className="text-sm text-gray-400 font-medium">Share a link or upload a file above.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {resources.map((r, i) => {
                        const isOwn = r.author_id === currentUserId;
                        const timestamp = new Date(r.created_at ?? "").toLocaleDateString("en-US", { month: "short", day: "numeric" });
                        const isFile = !!r.attachment;
                        const isLink = !isFile && isUrl(r.text);

                        return (
                            <motion.div
                                key={r.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(i * 0.05, 0.3), duration: 0.35 }}
                                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white border-2 border-gray-900 hover:shadow-[4px_4px_0px_#16a34a] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all duration-200 group"
                            >
                                {/* Icon */}
                                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-green-50 border-2 border-green-600/30 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                                    {isFile ? getFileEmoji(r.attachment!.mime_type, r.text) : isLink ? "🔗" : "📝"}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    {isLink ? (
                                        <a
                                            href={r.text}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-black text-green-700 hover:text-green-900 text-sm sm:text-base truncate block underline underline-offset-2 decoration-green-600/40"
                                        >
                                            {r.text}
                                        </a>
                                    ) : (
                                        <p className="font-black text-gray-900 text-sm sm:text-base truncate">
                                            {r.text}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-400 font-bold mt-0.5 flex items-center gap-1.5">
                                        <span>{isOwn ? "You" : "Member"}</span>
                                        <span>·</span>
                                        <span>{timestamp}</span>
                                        {isFile && r.attachment?.size && (
                                            <><span>·</span><span>{formatBytes(r.attachment.size)}</span></>
                                        )}
                                    </p>
                                </div>

                                {/* Download button for files */}
                                {isFile && (
                                    <a
                                        href={r.attachment!.url}
                                        download={r.text}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 sm:p-2.5 text-gray-400 hover:text-white hover:bg-green-600 rounded-lg border-2 border-transparent hover:border-green-600 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                                    >
                                        <Download size={16} />
                                    </a>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════
   SESSIONS TAB
═══════════════════════════════════ */
function SessionsTab() {
    const sessions = [
        {
            title: "Midterm Prep — Chapters 1-5",
            host: "Sarah C.",
            time: "Today, 4:00 PM",
            spots: "3/6",
            active: true,
        },
        {
            title: "Problem Set Review",
            host: "Alex K.",
            time: "Tomorrow, 2:00 PM",
            spots: "1/4",
            active: false,
        },
        {
            title: "Final Exam Strategy Session",
            host: "Dr. Mike R.",
            time: "Friday, 6:00 PM",
            spots: "5/8",
            active: false,
        },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-gray-900 rounded-full text-xs font-black text-gray-900 uppercase tracking-widest mb-4 shadow-[2px_2px_0px_#16a34a]">
                        📅 Sessions
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                        Join or create study blocks
                    </h2>
                </div>
                <button className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg border-2 border-green-600 hover:border-green-700 transition-all flex items-center gap-2 shadow-[3px_3px_0px_#111827] active:scale-[0.97] self-start">
                    <Plus size={16} />
                    Create
                </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
                {sessions.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.35 }}
                        className="p-4 sm:p-6 rounded-xl bg-white border-2 border-gray-900 hover:shadow-[4px_4px_0px_#16a34a] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all duration-200"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-black text-gray-900 text-base sm:text-lg">
                                        {s.title}
                                    </h4>
                                    {s.active && (
                                        <span className="px-2.5 py-1 bg-green-600 text-white text-[10px] font-black rounded-md uppercase border-2 border-green-700 animate-pulse">
                                            Live
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-400 font-bold">
                                    Hosted by {s.host} &middot; {s.time}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                                <p className="text-sm font-black text-gray-500 tabular-nums">
                                    {s.spots} spots
                                </p>
                                <button
                                    className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all border-2 ${s.active
                                        ? "bg-green-600 text-white border-green-600 shadow-[3px_3px_0px_#111827] hover:bg-green-700 hover:border-green-700 active:scale-[0.97]"
                                        : "bg-white text-gray-900 border-gray-900 hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-[3px_3px_0px_#111827] hover:-translate-x-[1px] hover:-translate-y-[1px]"
                                    }`}
                                >
                                    {s.active ? "Join Now" : "Reserve"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty slots CTA */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-4 sm:mt-6 p-5 sm:p-7 rounded-xl bg-green-50 border-2 border-dashed border-green-600 relative overflow-hidden"
            >
                <DoodleStar className="absolute top-3 right-4 w-5 h-5 text-green-600/20 rotate-12" />
                <DoodleCircle className="absolute bottom-3 right-16 w-7 h-7 text-green-600/15 hidden sm:block" />
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-lg border-2 border-green-700 flex items-center justify-center flex-shrink-0">
                            <Zap size={18} className="text-white" />
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 text-base mb-1">
                                Can&apos;t find a good time?
                            </h4>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                Create your own study session and others will
                                join. It&apos;s that simple.
                            </p>
                        </div>
                    </div>
                    <button className="px-5 py-3 bg-gray-900 text-white font-bold text-sm rounded-lg border-2 border-gray-900 hover:shadow-[3px_3px_0px_#16a34a] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all flex-shrink-0 flex items-center gap-2">
                        <Plus size={14} />
                        Create session
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
