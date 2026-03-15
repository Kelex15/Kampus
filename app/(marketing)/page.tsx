"use client";

import Link from "next/link";
import { useRef } from "react";
import {
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    Check,
    GraduationCap,
    MessageSquare,
    Star,
    Users,
    Zap,
} from "lucide-react";
import { motion, useInView } from "framer-motion";

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

const stats = [
    { number: "2,400+", label: "Active students", emoji: "👨‍🎓", icon: Users },
    { number: "150+", label: "Course rooms", emoji: "📚", icon: BookOpen },
    { number: "94%", label: "Success rate", emoji: "⭐", icon: Star },
    {
        number: "500+",
        label: "Alumni mentors",
        emoji: "🎓",
        icon: GraduationCap,
    },
];

const testimonials = [
    {
        quote: "The MAAC 3021 room saved my semester. Alumni shared study strategies that actually worked, and I connected with classmates I wouldn't have met otherwise.",
        name: "Sarah Chen",
        major: "Computer Science '24",
        initials: "SC",
    },
    {
        quote: "Honestly this app is better than RateMyProf + Discord combined. Upper years literally spoon-fed me success.",
        name: "Jason Patel",
        major: "Software Engineering '26",
        initials: "JP",
    },
    {
        quote: "I found my study group AND a mentor here. Uni feels way less scary when other people have your back.",
        name: "Emily Nguyen",
        major: "Biology '23",
        initials: "EN",
    },
];

const features = [
    {
        icon: MessageSquare,
        title: "Course Rooms",
        desc: "Persistent chats for every course. Current students, alumni, incoming — one thread that never dies.",
    },
    {
        icon: Star,
        title: "Course Intel",
        desc: "Real difficulty ratings, time commitments, and grade distributions from people who've been there.",
    },
    {
        icon: GraduationCap,
        title: "Alumni Mentors",
        desc: "Connect with grads who aced your hardest courses. Get strategies, not just answers.",
    },
    {
        icon: Zap,
        title: "Live Chat",
        desc: "Real-time sidebar in every room. Quick answers when you need them most.",
    },
];

/* ─── Component ─── */

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* ═══════════════════════════════
                NAVBAR
            ═══════════════════════════════ */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-2xl border-b-[3px] border-gray-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 group"
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-lg border-2 border-gray-900 flex items-center justify-center group-hover:bg-green-600 group-hover:shadow-[2px_2px_0px_#111827] group-hover:-translate-x-[1px] group-hover:-translate-y-[1px] transition-all duration-200">
                            <span className="text-white font-black text-base sm:text-lg">
                                K
                            </span>
                        </div>
                        <span className="text-base sm:text-lg font-black tracking-tight text-gray-900">
                            kampus
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1.5">
                        {[
                            { href: "/", label: "Home" },
                            { href: "#about", label: "About" },
                            { href: "/dashboard", label: "Courses" },
                        ].map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="px-4 py-2.5 text-base text-gray-500 hover:text-gray-900 font-bold rounded-lg transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="w-0.5 h-7 bg-gray-900/10 mx-2 rounded-full" />
                        <Link
                            href="/login"
                            className="px-4 py-2.5 text-base text-gray-500 hover:text-gray-900 font-bold rounded-lg transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/signup"
                            className="ml-1 px-5 py-2.5 bg-green-600 text-white text-base font-bold rounded-lg border-2 border-green-600 hover:bg-green-700 hover:border-green-700 transition-all shadow-[3px_3px_0px_#111827]"
                        >
                            Sign up
                        </Link>
                    </div>

                    {/* Mobile CTA */}
                    <Link
                        href="/signup"
                        className="md:hidden px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg border-2 border-green-600 shadow-[2px_2px_0px_#111827]"
                    >
                        Sign up
                    </Link>
                </div>
            </nav>

            {/* ═══════════════════════════════
                HERO SECTION
            ═══════════════════════════════ */}
            <section className="relative pt-28 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-green-50 border-b-[3px] border-gray-900 overflow-hidden">
                <DotGrid className="opacity-[0.15]" />

                {/* Doodles */}
                <DoodleStar className="absolute top-24 right-6 sm:right-16 w-7 h-7 sm:w-10 sm:h-10 text-green-600/40 rotate-12" />
                <DoodleStar className="absolute bottom-16 right-[30%] w-5 h-5 text-green-600/25 -rotate-6 hidden sm:block" />
                <DoodleCircle className="absolute top-32 right-32 sm:right-52 w-10 h-10 sm:w-14 sm:h-14 text-green-600/20 hidden sm:block" />
                <DoodleZigzag className="absolute bottom-8 right-8 sm:right-20 w-16 sm:w-24 text-green-600/20 hidden lg:block" />
                <DoodleCross className="absolute top-40 left-[60%] w-5 h-5 text-green-600/15 hidden md:block" />
                <DoodleArrow className="absolute bottom-20 left-4 sm:left-12 w-14 sm:w-20 text-green-600/25 rotate-6 hidden sm:block" />
                <DoodleSpring className="absolute top-28 right-[22%] w-5 h-auto text-green-600/15 hidden xl:block" />
                <DoodleStar className="absolute bottom-10 left-[45%] w-5 h-5 text-green-600/20 rotate-45 hidden lg:block" />

                <div className="relative max-w-5xl mx-auto text-center">
                    <FadeIn>
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border-2 border-gray-900 rounded-full mb-8 shadow-[3px_3px_0px_#16a34a]"
                        >
                            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm sm:text-base font-black text-gray-900 uppercase tracking-wider">
                                10,000+ students &middot; 500+ courses &middot;
                                1 platform
                            </span>
                        </motion.div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-gray-900 leading-[0.95] mb-6 sm:mb-8">
                            The Academic
                            <br />
                            <span className="relative inline-block">
                                Social Layer
                                <HandDrawnUnderline className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-3 sm:h-4 text-green-600" />
                            </span>
                            <br />
                            <span className="text-gray-300">
                                for Universities
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium mb-10 sm:mb-12">
                            Kampus connects students, courses, professors, and
                            resources in one vibrant platform. Replace scattered
                            WhatsApp groups, outdated rating sites, and random
                            Google Docs with a modern hub for academic life.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                            <Link
                                href="/signup"
                                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 sm:py-5 bg-green-600 text-white text-base sm:text-lg font-bold rounded-xl border-2 border-green-600 hover:bg-green-700 hover:border-green-700 transition-all active:scale-[0.97] shadow-[5px_5px_0px_#111827]"
                            >
                                Get Started
                                <ArrowRight
                                    size={18}
                                    className="group-hover:translate-x-0.5 transition-transform"
                                />
                            </Link>
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 sm:py-5 text-gray-900 text-base sm:text-lg font-bold rounded-xl border-2 border-gray-900 bg-white hover:shadow-[5px_5px_0px_#16a34a] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
                            >
                                Browse Courses
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ═══════════════════════════════
                STATS SECTION
            ═══════════════════════════════ */}
            <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b-[3px] border-gray-900 overflow-hidden">
                <DotGrid className="opacity-[0.05]" />

                <div className="relative max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        {stats.map((stat, i) => (
                            <FadeIn key={i} delay={i * 0.08}>
                                <div className="p-5 sm:p-6 bg-white border-2 border-gray-900 rounded-xl text-center hover:shadow-[5px_5px_0px_#16a34a] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-200 group">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 bg-green-50 border-2 border-green-600/30 rounded-xl flex items-center justify-center group-hover:bg-green-600 group-hover:border-green-600 transition-all">
                                        <stat.icon
                                            size={22}
                                            className="text-green-600 group-hover:text-white transition-colors"
                                        />
                                    </div>
                                    <div className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight tabular-nums mb-1">
                                        {stat.number}
                                    </div>
                                    <div className="text-sm sm:text-base text-gray-500 font-bold">
                                        {stat.label}
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════
                FEATURES SECTION
            ═══════════════════════════════ */}
            <section
                id="about"
                className="relative py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gray-900 border-b-[3px] border-gray-900 overflow-hidden"
            >
                <GridPattern className="text-white/[0.03]" />

                <DoodleStar className="absolute top-10 right-10 w-8 h-8 text-green-500/20 rotate-12 hidden lg:block" />
                <DoodleZigzag className="absolute bottom-10 left-8 w-20 text-green-500/15 hidden lg:block" />
                <DoodleCircle className="absolute top-32 left-[70%] w-12 h-12 text-green-500/10 hidden xl:block" />

                <div className="relative max-w-6xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-14 sm:mb-20">
                            <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-black uppercase tracking-wider mb-8 border-2 border-green-500">
                                ✦ Why Kampus
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-5">
                                Everything you need,{" "}
                                <span className="relative inline-block">
                                    one place
                                    <HandDrawnUnderline className="absolute -bottom-1 left-0 w-full h-2.5 sm:h-3 text-green-500" />
                                </span>
                            </h2>
                            <p className="text-lg sm:text-xl text-white/50 max-w-lg mx-auto leading-relaxed font-medium">
                                Built by students who were tired of the chaos.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                        {features.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <FadeIn key={i} delay={i * 0.08}>
                                    <div className="group p-6 sm:p-7 rounded-xl bg-white/[0.04] border-2 border-white/10 hover:border-green-500 hover:shadow-[5px_5px_0px_#16a34a] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-200">
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
                                            {feature.desc}
                                        </p>
                                    </div>
                                </FadeIn>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════
                TESTIMONIALS
            ═══════════════════════════════ */}
            <section className="relative py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-green-50 border-b-[3px] border-gray-900 overflow-hidden">
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
                                What students are{" "}
                                <span className="relative inline-block">
                                    saying
                                    <HandDrawnUnderline className="absolute -bottom-1 left-0 w-full h-2.5 sm:h-3 text-green-600" />
                                </span>
                            </h2>
                        </div>
                    </FadeIn>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {testimonials.map((t, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="bg-white rounded-xl border-2 border-gray-900 p-6 sm:p-8 hover:shadow-[5px_5px_0px_#16a34a] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-200 h-full flex flex-col group">
                                    {/* Quote icon */}
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 border-2 border-gray-900 rounded-lg flex items-center justify-center mb-5 group-hover:bg-green-600 transition-colors">
                                        <svg
                                            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                        </svg>
                                    </div>

                                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 flex-1 font-medium">
                                        &ldquo;{t.quote}&rdquo;
                                    </p>

                                    <div className="border-t-2 border-dashed border-gray-200 pt-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-green-600 border-2 border-gray-900 flex items-center justify-center text-xs sm:text-sm font-black text-white">
                                                {t.initials}
                                            </div>
                                            <div>
                                                <p className="text-base font-black text-gray-900">
                                                    {t.name}
                                                </p>
                                                <p className="text-sm text-gray-400 font-bold">
                                                    {t.major}
                                                </p>
                                            </div>
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
                            ready to join
                            <br />
                            your{" "}
                            <span className="relative inline-block">
                                community
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
                            <span className="text-green-600">?</span>
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.15}>
                        <p className="text-lg sm:text-xl lg:text-2xl text-gray-500 mb-10 max-w-md mx-auto leading-relaxed font-medium">
                            Start connecting with students who&apos;ve been
                            where you are — and where you&apos;re going.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.25}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                            <Link
                                href="/signup"
                                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 sm:py-5 bg-green-600 text-white text-base sm:text-lg font-bold rounded-xl border-2 border-green-600 hover:bg-green-700 hover:border-green-700 transition-all active:scale-[0.97] shadow-[5px_5px_0px_#111827]"
                            >
                                Let&apos;s go
                                <ArrowRight
                                    size={18}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            </Link>
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 sm:py-5 text-gray-900 text-base sm:text-lg font-bold rounded-xl border-2 border-gray-900 bg-white hover:shadow-[5px_5px_0px_#16a34a] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
                            >
                                Browse courses
                            </Link>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.35}>
                        <div className="mt-8 inline-flex items-center gap-6 sm:gap-8 flex-wrap justify-center">
                            {[
                                "No credit card",
                                "Free forever",
                                "30 sec signup",
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
                        © 2025 Kampus. Built for students, by students.
                    </p>
                </div>
            </footer>
        </div>
    );
}
