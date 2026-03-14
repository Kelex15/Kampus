"use client";

import { useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useInView,
} from "framer-motion";
import Link from "next/link";
import PageShell from "@/components/shared/PageShell";
import { TextRevealByWord } from "@/components/ui/text-reveal";
import {
    MessageSquare,
    Users,
    BarChart3,
    GraduationCap,
    FileText,
    Zap,
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    Check,
} from "lucide-react";

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

/* ─── FadeIn ─── */
function FadeIn({
                    children,
                    className = "",
                    delay = 0,
                }: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 0.7,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ─── Data ─── */
const features = [
    {
        icon: MessageSquare,
        title: "Course Rooms",
        description:
            "Persistent chats for every course. Current students, alumni, incoming — one thread that never dies.",
    },
    {
        icon: BarChart3,
        title: "Course Intel",
        description:
            "Real difficulty ratings, time commitments, and grade distributions from people who've been there.",
    },
    {
        icon: GraduationCap,
        title: "Alumni Mentors",
        description:
            "Connect with grads who aced your hardest courses. Get strategies, not just answers.",
    },
    {
        icon: FileText,
        title: "Shared Resources",
        description:
            "Community-uploaded study guides, notes, and materials. Rated by actual usefulness.",
    },
    {
        icon: Users,
        title: "Study Sessions",
        description:
            "Create focused study blocks. Find accountability partners who share your schedule.",
    },
    {
        icon: Zap,
        title: "Live Chat",
        description:
            "Real-time sidebar in every room. Quick answers when you need them most.",
    },
];

const testimonials = [
    {
        quote:
            "The course intel saved me from picking a nightmare schedule. Alumni actually tell you what works and what doesn't.",
        name: "Sarah Chen",
        detail: "Computer Science · 3rd Year",
        emoji: "🧠",
    },
    {
        quote:
            "Way better than 12 different WhatsApp groups. Everything about a course — people, resources, advice — one place.",
        name: "Jason Patel",
        detail: "Software Engineering · 2nd Year",
        emoji: "💬",
    },
    {
        quote:
            "Found my study group and a mentor in week one. Uni hits different when people have your back fr.",
        name: "Emily Nguyen",
        detail: "Biology · 4th Year",
        emoji: "🤝",
    },
];

/* ─── Page ─── */
export default function LandingPage() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.97]);

    return (
        <PageShell>
            {/* ═══════════════════════════════
                HERO — Bento Grid
            ═══════════════════════════════ */}
            <section
                ref={heroRef}
                className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-green-50 border-b-[3px] border-gray-900 overflow-hidden"
            >
                <DotGrid className="opacity-[0.15]" />

                {/* Scattered doodles */}
                <DoodleStar className="absolute top-20 right-6 sm:right-12 w-7 h-7 sm:w-9 sm:h-9 text-green-600/40 rotate-12" />
                <DoodleCircle className="absolute top-28 right-28 sm:right-48 w-10 h-10 sm:w-14 sm:h-14 text-green-600/20 hidden sm:block" />
                <DoodleZigzag className="absolute bottom-8 right-8 sm:right-20 w-16 sm:w-24 text-green-600/25 hidden lg:block" />
                <DoodleCross className="absolute top-36 left-[60%] w-5 h-5 text-green-600/20 hidden md:block" />
                <DoodleArrow className="absolute bottom-16 left-4 sm:left-12 w-14 sm:w-20 text-green-600/25 rotate-6 hidden sm:block" />
                <DoodleSpring className="absolute top-24 right-[25%] w-5 h-auto text-green-600/15 hidden xl:block" />
                <DoodleStar className="absolute bottom-12 left-[40%] w-5 h-5 text-green-600/25 -rotate-12 hidden lg:block" />

                <motion.div
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="relative max-w-6xl mx-auto"
                >
                    <div className="grid grid-cols-12 gap-3 sm:gap-4 auto-rows-min">
                        {/* ── Main headline ── */}
                        <FadeIn className="col-span-12 lg:col-span-8 bg-white rounded-xl border-2 border-gray-900 p-7 sm:p-10 lg:p-14 relative overflow-hidden shadow-[6px_6px_0px_#16a34a]">
                            <div className="relative z-10">
                                <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gray-900 text-white text-xs sm:text-sm font-black uppercase tracking-wider mb-8 sm:mb-10 border-2 border-gray-900">
                                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                                    Early access — free forever
                                </span>

                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[0.92] mb-6 sm:mb-8 text-gray-900">
                                    your uni,
                                    <br />
                                    <span className="text-gray-300">actually</span>
                                    <br />
                                    <span className="relative inline-block">
                                        connected
                                        <HandDrawnUnderline className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-3 sm:h-4 text-green-600" />
                                    </span>
                                    <span className="text-green-600">.</span>
                                </h1>

                                <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-lg leading-relaxed font-medium">
                                    Courses, profs, resources, and the people who
                                    make university worth it — one platform.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 mt-8 sm:mt-10">
                                    <Link
                                        href="/signup"
                                        className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-green-600 text-white text-base font-bold rounded-xl border-2 border-green-600 hover:bg-green-700 hover:border-green-700 transition-all active:scale-[0.97] shadow-[4px_4px_0px_#111827]"
                                    >
                                        Get started free
                                        <ArrowRight
                                            size={18}
                                            className="group-hover:translate-x-0.5 transition-transform"
                                        />
                                    </Link>
                                    <Link
                                        href="/discover"
                                        className="inline-flex items-center justify-center gap-2 px-7 py-4 text-gray-900 text-base font-bold rounded-xl border-2 border-gray-900 hover:shadow-[4px_4px_0px_#16a34a] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all bg-white"
                                    >
                                        Browse courses
                                    </Link>
                                </div>
                            </div>
                        </FadeIn>

                        {/* ── Dark accent card ── */}
                        <FadeIn
                            delay={0.1}
                            className="col-span-12 sm:col-span-6 lg:col-span-4 bg-gray-900 rounded-xl border-2 border-gray-900 p-6 sm:p-8 text-white relative overflow-hidden min-h-[280px] flex flex-col justify-between shadow-[6px_6px_0px_#16a34a]"
                        >
                            <GridPattern className="text-white/[0.04]" />
                            <div className="relative">
                                <div className="w-12 h-12 bg-green-600 rounded-xl border-2 border-green-500 flex items-center justify-center mb-6">
                                    <BookOpen className="text-white" size={22} />
                                </div>
                                <p className="text-white/70 text-base sm:text-lg leading-relaxed font-medium">
                                    Stop rebuilding your support network every
                                    semester. Knowledge shouldn&apos;t disappear
                                    when people graduate.
                                </p>
                            </div>
                            <Link
                                href="/discover"
                                className="relative text-green-500 text-base font-bold flex items-center gap-1.5 hover:gap-3 transition-all mt-6 w-fit"
                            >
                                Explore rooms
                                <ArrowUpRight size={16} />
                            </Link>
                        </FadeIn>

                        {/* ── CTA card (green) ── */}
                        <FadeIn
                            delay={0.15}
                            className="col-span-12 sm:col-span-6 lg:col-span-4 bg-green-600 rounded-xl border-2 border-gray-900 p-6 sm:p-8 flex flex-col justify-between min-h-[220px] shadow-[6px_6px_0px_#111827]"
                        >
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black text-white mb-3 tracking-tight">
                                    Ready to stop winging it?
                                </h3>
                                <p className="text-white/70 text-base leading-relaxed font-medium">
                                    30 seconds to sign up. Zero credit cards.
                                    Forever.
                                </p>
                            </div>
                            <Link
                                href="/signup"
                                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white text-gray-900 text-base font-bold rounded-xl border-2 border-gray-900 w-fit hover:shadow-[3px_3px_0px_#111827] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all mt-5"
                            >
                                Get started
                                <ArrowRight
                                    size={16}
                                    className="group-hover:translate-x-0.5 transition-transform"
                                />
                            </Link>
                        </FadeIn>

                        {/* ── Stats card ── */}
                        <FadeIn
                            delay={0.2}
                            className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white rounded-xl border-2 border-gray-900 p-6 sm:p-8 shadow-[6px_6px_0px_#16a34a]"
                        >
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-6">
                                The numbers
                            </span>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                {[
                                    { val: "2.4k+", label: "students" },
                                    { val: "150+", label: "rooms" },
                                    { val: "94%", label: "recommend" },
                                    { val: "500+", label: "mentors" },
                                ].map((s, i) => (
                                    <div key={i}>
                                        <div className="text-3xl sm:text-4xl font-black tracking-tight tabular-nums text-gray-900">
                                            {s.val}
                                        </div>
                                        <div className="text-sm sm:text-base text-gray-500 mt-1 font-medium">
                                            {s.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        {/* ── Social proof card ── */}
                        <FadeIn
                            delay={0.25}
                            className="col-span-12 sm:col-span-6 lg:col-span-4 bg-gray-100 rounded-xl border-2 border-gray-900 p-6 sm:p-8 flex flex-col justify-center shadow-[6px_6px_0px_#16a34a]"
                        >
                            <div className="flex -space-x-2 mb-5">
                                {["🧑‍🎓", "👩‍💻", "🧑‍🔬", "👨‍🎨", "👩‍🏫"].map(
                                    (emoji, i) => (
                                        <div
                                            key={i}
                                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-gray-900 flex items-center justify-center text-lg shadow-sm"
                                        >
                                            {emoji}
                                        </div>
                                    )
                                )}
                            </div>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-medium">
                                <span className="font-black text-gray-900">
                                    2,400+ students
                                </span>{" "}
                                from 12 universities are already here.
                                You&apos;re next.
                            </p>
                        </FadeIn>
                    </div>
                </motion.div>
            </section>

            {/* ═══════════════════════════════
                SCROLL TEXT REVEAL
            ═══════════════════════════════ */}
            <section className="relative bg-white border-b-[3px] border-gray-900">
                <TextRevealByWord text="Stop juggling five different apps just to survive one semester. Your courses deserve better. Your time deserves better. You deserve better." />
            </section>

            {/* ═══════════════════════════════
                PROBLEM → SOLUTION
            ═══════════════════════════════ */}
            <section className="relative py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
                <DotGrid className="opacity-[0.05]" />
                <DoodleStar className="absolute top-12 right-10 w-7 h-7 text-green-600/15 rotate-45 hidden lg:block" />
                <DoodleCross className="absolute bottom-20 left-8 w-5 h-5 text-green-600/15 hidden lg:block" />

                <div className="relative max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        <FadeIn>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-300 rounded-full text-xs font-black text-red-600 uppercase tracking-widest mb-6">
                                ✕ The problem
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] mb-6 text-gray-900">
                                University has a{" "}
                                <span className="relative inline-block">
                                    fragmentation
                                    <HandDrawnUnderline className="absolute -bottom-1 left-0 w-full h-2.5 sm:h-3 text-red-500" />
                                </span>{" "}
                                problem.
                            </h2>
                            <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed font-medium">
                                Every semester, students rebuild their support
                                network from scratch. Knowledge gets lost.
                                Connections disappear. The people who could help
                                you most have already graduated.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.15}>
                            <div className="space-y-3 sm:space-y-4">
                                {[
                                    "Scattered WhatsApp groups for every course",
                                    "Outdated professor rating websites",
                                    "Random Google Docs shared once, lost forever",
                                    "Reddit threads with zero structure",
                                    "No bridge between current students and alumni",
                                ].map((problem, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: 0.1 + i * 0.08,
                                            duration: 0.5,
                                        }}
                                        className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-white border-2 border-gray-900 hover:shadow-[4px_4px_0px_#ef4444] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-red-100 border-2 border-red-300 group-hover:bg-red-500 group-hover:border-red-500 flex items-center justify-center flex-shrink-0 transition-all">
                                            <span className="text-red-500 group-hover:text-white text-xs font-black transition-colors">
                                                ✕
                                            </span>
                                        </div>
                                        <span className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium">
                                            {problem}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════
                FEATURES — Dark Section
            ═══════════════════════════════ */}
            <section className="relative py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gray-900 border-y-[3px] border-gray-900 overflow-hidden">
                <GridPattern className="text-white/[0.03]" />

                <DoodleStar className="absolute top-10 right-10 w-8 h-8 text-green-500/20 rotate-12 hidden lg:block" />
                <DoodleZigzag className="absolute bottom-10 left-8 w-20 text-green-500/15 hidden lg:block" />
                <DoodleCircle className="absolute top-32 left-[70%] w-12 h-12 text-green-500/10 hidden xl:block" />

                <div className="relative max-w-6xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-14 sm:mb-20">
                            <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-black uppercase tracking-wider mb-8 border-2 border-green-500">
                                ✦ The solution
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-5">
                                One place for everything{" "}
                                <span className="relative inline-block">
                                    academic
                                    <HandDrawnUnderline className="absolute -bottom-1 left-0 w-full h-2.5 sm:h-3 text-green-500" />
                                </span>
                            </h2>
                            <p className="text-lg sm:text-xl text-white/50 max-w-lg mx-auto leading-relaxed font-medium">
                                Built by students who were tired of the chaos.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {features.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <FadeIn key={i} delay={i * 0.06}>
                                    <div className="group h-full p-6 sm:p-7 rounded-xl bg-white/[0.04] border-2 border-white/10 hover:border-green-500 hover:shadow-[5px_5px_0px_#16a34a] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-200">
                                        <div className="w-12 h-12 rounded-xl bg-white/[0.06] border-2 border-white/10 group-hover:bg-green-600 group-hover:border-green-600 flex items-center justify-center mb-5 transition-all duration-300">
                                            <Icon
                                                size={22}
                                                className="text-white/50 group-hover:text-white transition-colors duration-300"
                                            />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-black text-white mb-3 tracking-tight">
                                            {feature.title}
                                        </h3>
                                        <p className="text-base text-white/40 leading-relaxed group-hover:text-white/60 transition-colors duration-300 font-medium">
                                            {feature.description}
                                        </p>
                                    </div>
                                </FadeIn>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════
                HOW IT WORKS
            ═══════════════════════════════ */}
            <section className="relative py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
                <DotGrid className="opacity-[0.05]" />
                <DoodleArrow className="absolute top-16 right-12 w-16 text-green-600/15 -rotate-12 hidden lg:block" />
                <DoodleStar className="absolute bottom-16 left-10 w-6 h-6 text-green-600/15 rotate-45 hidden lg:block" />

                <div className="relative max-w-5xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-14 sm:mb-20">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border-2 border-green-600 rounded-full text-xs font-black text-green-700 uppercase tracking-widest mb-6">
                                How it works
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900">
                                Stupidly{" "}
                                <span className="relative inline-block">
                                    simple
                                    <HandDrawnUnderline className="absolute -bottom-1 left-0 w-full h-2.5 sm:h-3 text-green-600" />
                                </span>{" "}
                                to start
                            </h2>
                        </div>
                    </FadeIn>

                    <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
                        {[
                            {
                                step: "01",
                                title: "Find your courses",
                                desc: "Search and join rooms for courses you're taking — or planning to take next semester.",
                                accent: false,
                            },
                            {
                                step: "02",
                                title: "Connect with people",
                                desc: "Chat with classmates, get advice from alumni, find study partners who actually show up.",
                                accent: true,
                            },
                            {
                                step: "03",
                                title: "Learn smarter",
                                desc: "Access course intel, shared resources, and mentorship — all in one place.",
                                accent: false,
                            },
                        ].map((item, i) => (
                            <FadeIn key={i} delay={i * 0.12}>
                                <div
                                    className={`p-6 sm:p-8 rounded-xl border-2 border-gray-900 relative overflow-hidden h-full transition-all duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px] ${
                                        item.accent
                                            ? "bg-green-600 text-white shadow-[6px_6px_0px_#111827] hover:shadow-[8px_8px_0px_#111827]"
                                            : "bg-white shadow-[6px_6px_0px_#16a34a] hover:shadow-[8px_8px_0px_#16a34a]"
                                    }`}
                                >
                                    <span
                                        className={`text-[80px] sm:text-[100px] font-black leading-none tracking-tighter block mb-4 sm:mb-6 ${
                                            item.accent
                                                ? "text-white/15"
                                                : "text-gray-900/[0.05]"
                                        }`}
                                    >
                                        {item.step}
                                    </span>
                                    <h3
                                        className={`text-xl sm:text-2xl font-black mb-3 tracking-tight ${
                                            item.accent
                                                ? "text-white"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        {item.title}
                                    </h3>
                                    <p
                                        className={`text-base sm:text-lg leading-relaxed font-medium ${
                                            item.accent
                                                ? "text-white/70"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {item.desc}
                                    </p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════
                TESTIMONIALS
            ═══════════════════════════════ */}
            <section className="relative py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-green-50 border-y-[3px] border-gray-900 overflow-hidden">
                <DotGrid className="opacity-[0.12]" />
                <DoodleStar className="absolute top-10 left-10 w-7 h-7 text-green-600/30 rotate-12 hidden lg:block" />
                <DoodleCircle className="absolute bottom-12 right-12 w-10 h-10 text-green-600/20 hidden lg:block" />
                <DoodleZigzag className="absolute top-20 right-[20%] w-16 text-green-600/15 hidden xl:block" />

                <div className="relative max-w-6xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-14 sm:mb-20">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-900 rounded-full text-xs font-black text-gray-900 uppercase tracking-widest mb-6 shadow-[3px_3px_0px_#16a34a]">
                                💬 Testimonials
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 mb-4">
                                Don&apos;t take our{" "}
                                <span className="relative inline-block">
                                    word
                                    <HandDrawnUnderline className="absolute -bottom-1 left-0 w-full h-2.5 sm:h-3 text-green-600" />
                                </span>{" "}
                                for it
                            </h2>
                            <p className="text-gray-500 text-lg sm:text-xl font-medium">
                                Real students. Real experiences.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {testimonials.map((t, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="bg-white rounded-xl border-2 border-gray-900 p-6 sm:p-8 hover:shadow-[5px_5px_0px_#16a34a] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-200 h-full flex flex-col group">
                                    <span className="text-4xl sm:text-5xl mb-6 block group-hover:scale-110 transition-transform duration-300 w-fit">
                                        {t.emoji}
                                    </span>

                                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 flex-1 font-medium">
                                        &ldquo;{t.quote}&rdquo;
                                    </p>

                                    <div className="flex items-center gap-3 pt-5 border-t-2 border-dashed border-gray-200">
                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-green-600 border-2 border-gray-900 flex items-center justify-center text-xs sm:text-sm font-black text-white tracking-wider">
                                            {t.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-gray-900">
                                                {t.name}
                                            </p>
                                            <p className="text-sm text-gray-400 font-medium">
                                                {t.detail}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════
                FINAL CTA
            ═══════════════════════════════ */}
            <section className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
                <DotGrid className="opacity-[0.05]" />
                <DoodleStar className="absolute top-16 right-16 w-8 h-8 text-green-600/15 rotate-12 hidden lg:block" />
                <DoodleArrow className="absolute bottom-20 left-12 w-16 text-green-600/15 rotate-12 hidden lg:block" />
                <DoodleCross className="absolute top-24 left-[20%] w-5 h-5 text-green-600/10 hidden xl:block" />
                <DoodleCircle className="absolute bottom-28 right-[25%] w-10 h-10 text-green-600/10 hidden xl:block" />

                <div className="relative max-w-3xl mx-auto text-center">
                    <FadeIn>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[0.95] mb-6 text-gray-900">
                            your semester
                            <br />
                            <span className="relative inline-block">
                                starts here
                                <motion.span
                                    className="absolute -bottom-1.5 sm:-bottom-2 left-0 h-3 sm:h-4 bg-green-600 w-full -z-10 rounded-sm"
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: 0.3,
                                        duration: 0.6,
                                        ease: "easeOut",
                                    }}
                                    style={{ transformOrigin: "left" }}
                                />
                            </span>
                            <span className="text-green-600">.</span>
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.15}>
                        <p className="text-lg sm:text-xl lg:text-2xl text-gray-500 mb-10 max-w-md mx-auto leading-relaxed font-medium">
                            Join the platform that connects every part of your
                            academic life.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.25}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                            <Link
                                href="/signup"
                                className="group inline-flex items-center gap-2.5 px-8 py-4 sm:py-5 bg-green-600 text-white text-base sm:text-lg font-bold rounded-xl border-2 border-green-600 hover:bg-green-700 hover:border-green-700 transition-all active:scale-[0.97] shadow-[5px_5px_0px_#111827]"
                            >
                                Get started — it&apos;s free
                                <ArrowRight
                                    size={18}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            </Link>
                            <Link
                                href="/discover"
                                className="inline-flex items-center gap-2 px-8 py-4 sm:py-5 text-gray-900 text-base sm:text-lg font-bold rounded-xl border-2 border-gray-900 bg-white hover:shadow-[5px_5px_0px_#16a34a] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
                            >
                                Browse courses
                            </Link>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.35}>
                        <div className="mt-8 inline-flex items-center gap-6 sm:gap-8 flex-wrap justify-center">
                            {[
                                "Free forever",
                                "No credit card",
                                "30 second signup",
                            ].map((item) => (
                                <span
                                    key={item}
                                    className="flex items-center gap-2 text-sm sm:text-base text-gray-400 font-bold"
                                >
                                    <Check
                                        size={16}
                                        className="text-green-600"
                                    />
                                    {item}
                                </span>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ═══════════════════════════════
                FOOTER
            ═══════════════════════════════ */}
            <footer className="relative py-10 sm:py-12 px-4 sm:px-6 lg:px-8 border-t-[3px] border-gray-900 bg-gray-900">
                <DoodleZigzag className="absolute top-3 left-6 w-12 text-green-600/15 hidden sm:block" />
                <DoodleStar className="absolute bottom-3 right-8 w-5 h-5 text-green-600/15 rotate-45 hidden sm:block" />

                <div className="relative max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 group"
                    >
                        <div className="w-9 h-9 bg-green-600 rounded-lg border-2 border-green-500 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                            <span className="text-white font-black text-sm">
                                K
                            </span>
                        </div>
                        <span className="text-base font-black tracking-tight text-white">
                            kampus
                        </span>
                    </Link>

                    <div className="flex items-center gap-6 sm:gap-8 text-sm sm:text-base text-gray-400 font-bold">
                        <a
                            href="#"
                            className="hover:text-green-500 transition-colors"
                        >
                            About
                        </a>
                        <a
                            href="#"
                            className="hover:text-green-500 transition-colors"
                        >
                            Privacy
                        </a>
                        <a
                            href="#"
                            className="hover:text-green-500 transition-colors"
                        >
                            Terms
                        </a>
                        <a
                            href="#"
                            className="hover:text-green-500 transition-colors"
                        >
                            Twitter
                        </a>
                    </div>

                    <p className="text-sm sm:text-base text-gray-500 font-medium">
                        © 2025 Kampus
                    </p>
                </div>
            </footer>
        </PageShell>
    );
}