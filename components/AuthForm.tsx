"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    Mail,
    Lock,
    GraduationCap,
    ArrowRight,
    ChevronDown,
    User,
    BookOpen,
    Sparkles,
    Check,
    Zap,
    Users,
    Star,
    ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { listSchools } from "@/queries/schools";
import type { School } from "@/queries/schools";

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
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
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
                backgroundSize: "60px 60px",
            }}
        />
    );
}

/* ─── Types ─── */

type Mode = "login" | "signup";

interface AuthFormProps {
    initialMode?: Mode;
}

/* ─── Main Component ─── */

export default function AuthForm({ initialMode = "login" }: AuthFormProps) {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>(initialMode);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [schoolId, setSchoolId] = useState<number | "">("");
    const [currentYear, setCurrentYear] = useState("1");
    const [schools, setSchools] = useState<School[]>([]);

    const [focused, setFocused] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        listSchools().then(setSchools).catch(() => {});
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (mode === "signup") {
                if (!schoolId)
                    throw new Error("Please select your university");
                if (!username)
                    throw new Error("Please choose a username");

                const client = getSupabaseBrowserClient();
                if (!client) throw new Error("Supabase not configured");
                const { data: signUpData, error: signUpError } = await client.auth.signUp({ email, password });
                if (signUpError) throw signUpError;
                const userId = signUpData.user?.id;
                if (userId) {
                    await client.from("profiles").upsert({
                        id: userId,
                        username: username || email.split("@")[0],
                        first_name: firstName || null,
                        last_name: lastName || null,
                        current_year: currentYear ? Number(currentYear) : null,
                        school_id: typeof schoolId === "number" ? schoolId : null,
                        role: "user",
                        type: "student",
                    });
                }
            } else {
                const client = getSupabaseBrowserClient();
                if (!client) throw new Error("Supabase not configured");
                const { error } = await client.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }

            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const inputBase =
        "w-full py-3.5 sm:py-4 bg-white border-2 border-gray-900 rounded-xl text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-600/20 focus-visible:border-green-600 transition-all font-medium";

    const labelClass =
        "block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5";

    return (
        <div className="min-h-screen bg-green-50 flex relative">
            {/* Background texture for mobile */}
            <DotGrid className="opacity-[0.1] lg:hidden" />

            {/* ── Left: Form ── */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-12 py-8 sm:py-12 relative z-10">
                {/* Mobile doodles */}
                <DoodleStar className="absolute top-6 right-6 w-6 h-6 text-green-600/25 rotate-12 lg:hidden" />
                <DoodleCircle className="absolute bottom-10 left-6 w-8 h-8 text-green-600/15 lg:hidden" />

                <div className="w-full max-w-[480px]">
                    {/* Back link */}
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-900 mb-8 sm:mb-10 transition-colors text-sm font-bold"
                    >
                        <ChevronLeft
                            size={16}
                            strokeWidth={2.5}
                            className="group-hover:-translate-x-0.5 transition-transform"
                        />
                        Home
                    </Link>

                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 mb-8 sm:mb-10 group"
                    >
                        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gray-900 rounded-lg border-2 border-gray-900 flex items-center justify-center group-hover:bg-green-600 group-hover:shadow-[2px_2px_0px_#111827] group-hover:-translate-x-[1px] group-hover:-translate-y-[1px] transition-all duration-200">
                            <span className="text-white font-black text-base sm:text-lg">
                                K
                            </span>
                        </div>
                        <span className="text-lg sm:text-xl font-black tracking-tight text-gray-900">
                            kampus
                        </span>
                    </Link>

                    {/* Header */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="mb-8"
                        >
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-3">
                                {mode === "login" ? (
                                    <>
                                        Welcome{" "}
                                        <span className="relative inline-block">
                                            back
                                            <HandDrawnUnderline className="absolute -bottom-1 left-0 w-full h-2.5 text-green-600" />
                                        </span>{" "}
                                        ✌️
                                    </>
                                ) : (
                                    <>
                                        Join the{" "}
                                        <span className="relative inline-block">
                                            community
                                            <HandDrawnUnderline className="absolute -bottom-1 left-0 w-full h-2.5 text-green-600" />
                                        </span>{" "}
                                        🎓
                                    </>
                                )}
                            </h1>
                            <p className="text-gray-500 text-base sm:text-lg font-medium">
                                {mode === "login"
                                    ? "Sign in to get back to your courses"
                                    : "Takes 30 seconds. No credit card. Ever."}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Form card */}
                    <div className="bg-white border-2 border-gray-900 rounded-xl p-5 sm:p-7 lg:p-8 shadow-[6px_6px_0px_#16a34a]">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="auth-email"
                                    className={labelClass}
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail
                                        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                                            focused === "email"
                                                ? "text-green-600"
                                                : "text-gray-400"
                                        }`}
                                        size={18}
                                    />
                                    <input
                                        id="auth-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        onFocus={() => setFocused("email")}
                                        onBlur={() => setFocused("")}
                                        placeholder="you@university.edu"
                                        className={`${inputBase} pl-12 pr-4`}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="auth-password"
                                    className={labelClass}
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                                            focused === "password"
                                                ? "text-green-600"
                                                : "text-gray-400"
                                        }`}
                                        size={18}
                                    />
                                    <input
                                        id="auth-password"
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        onFocus={() => setFocused("password")}
                                        onBlur={() => setFocused("")}
                                        placeholder="••••••••"
                                        className={`${inputBase} pl-12 pr-4`}
                                        required
                                        autoComplete={
                                            mode === "login"
                                                ? "current-password"
                                                : "new-password"
                                        }
                                    />
                                </div>
                            </div>

                            {/* Signup extras */}
                            <AnimatePresence>
                                {mode === "signup" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{
                                            opacity: 1,
                                            height: "auto",
                                        }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeOut",
                                        }}
                                        className="space-y-5 overflow-hidden"
                                    >
                                        {/* Dashed divider */}
                                        <div className="border-t-2 border-dashed border-gray-200 pt-1" />

                                        {/* Username */}
                                        <div>
                                            <label
                                                htmlFor="auth-username"
                                                className={labelClass}
                                            >
                                                Username
                                            </label>
                                            <div className="relative">
                                                <User
                                                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                                                        focused === "username"
                                                            ? "text-green-600"
                                                            : "text-gray-400"
                                                    }`}
                                                    size={18}
                                                />
                                                <input
                                                    id="auth-username"
                                                    type="text"
                                                    value={username}
                                                    onChange={(e) =>
                                                        setUsername(
                                                            e.target.value
                                                        )
                                                    }
                                                    onFocus={() =>
                                                        setFocused("username")
                                                    }
                                                    onBlur={() =>
                                                        setFocused("")
                                                    }
                                                    placeholder="your_handle"
                                                    className={`${inputBase} pl-12 pr-4`}
                                                    required
                                                    autoComplete="username"
                                                />
                                            </div>
                                        </div>

                                        {/* Name row */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label
                                                    htmlFor="auth-first"
                                                    className={labelClass}
                                                >
                                                    First name
                                                </label>
                                                <input
                                                    id="auth-first"
                                                    type="text"
                                                    value={firstName}
                                                    onChange={(e) =>
                                                        setFirstName(
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`${inputBase} px-4`}
                                                    placeholder="Optional"
                                                    autoComplete="given-name"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="auth-last"
                                                    className={labelClass}
                                                >
                                                    Last name
                                                </label>
                                                <input
                                                    id="auth-last"
                                                    type="text"
                                                    value={lastName}
                                                    onChange={(e) =>
                                                        setLastName(
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`${inputBase} px-4`}
                                                    placeholder="Optional"
                                                    autoComplete="family-name"
                                                />
                                            </div>
                                        </div>

                                        {/* University */}
                                        <div>
                                            <label
                                                htmlFor="auth-university"
                                                className={labelClass}
                                            >
                                                University
                                            </label>
                                            <div className="relative">
                                                <GraduationCap
                                                    className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-colors duration-200 ${
                                                        focused ===
                                                        "university"
                                                            ? "text-green-600"
                                                            : "text-gray-400"
                                                    }`}
                                                    size={18}
                                                />
                                                <select
                                                    id="auth-university"
                                                    value={schoolId}
                                                    onChange={(e) =>
                                                        setSchoolId(
                                                            e.target.value === "" ? "" : Number(e.target.value)
                                                        )
                                                    }
                                                    onFocus={() =>
                                                        setFocused(
                                                            "university"
                                                        )
                                                    }
                                                    onBlur={() =>
                                                        setFocused("")
                                                    }
                                                    className={`${inputBase} pl-12 pr-11 appearance-none cursor-pointer`}
                                                    required
                                                >
                                                    <option value="">
                                                        Select your university
                                                    </option>
                                                    {schools.map(
                                                        (school) => (
                                                            <option
                                                                key={school.id}
                                                                value={school.id}
                                                            >
                                                                {school.name}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                <ChevronDown
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                                    size={18}
                                                />
                                            </div>
                                        </div>

                                        {/* Year */}
                                        <div>
                                            <label
                                                htmlFor="auth-year"
                                                className={labelClass}
                                            >
                                                Year
                                            </label>
                                            <select
                                                id="auth-year"
                                                value={currentYear}
                                                onChange={(e) =>
                                                    setCurrentYear(
                                                        e.target.value
                                                    )
                                                }
                                                className={`${inputBase} px-4 appearance-none cursor-pointer`}
                                                required
                                            >
                                                <option value="1">
                                                    1st year
                                                </option>
                                                <option value="2">
                                                    2nd year
                                                </option>
                                                <option value="3">
                                                    3rd year
                                                </option>
                                                <option value="4">
                                                    4th year
                                                </option>
                                                <option value="5">
                                                    Grad / other
                                                </option>
                                            </select>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        className="text-base text-red-700 bg-red-50 border-2 border-red-300 rounded-xl px-4 py-3.5 font-bold flex items-start gap-3"
                                        role="alert"
                                    >
                                        <DoodleCross className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full py-4 sm:py-4.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-base sm:text-lg font-bold transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.97] border-2 border-green-600 hover:border-green-700 shadow-[4px_4px_0px_#111827] mt-2"
                            >
                                <span>
                                    {loading
                                        ? mode === "login"
                                            ? "Signing in…"
                                            : "Creating account…"
                                        : mode === "login"
                                            ? "Sign in"
                                            : "Create account"}
                                </span>
                                {!loading && (
                                    <ArrowRight
                                        size={18}
                                        className="group-hover:translate-x-0.5 transition-transform"
                                    />
                                )}
                            </button>

                            {mode === "login" && (
                                <div className="text-center">
                                    <button
                                        type="button"
                                        className="text-sm sm:text-base text-gray-400 hover:text-green-600 transition-colors font-bold underline decoration-2 underline-offset-2 decoration-gray-300 hover:decoration-green-600"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Toggle mode */}
                    <div className="mt-6 sm:mt-8 text-center">
                        <div className="inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-900 rounded-full shadow-[3px_3px_0px_#16a34a]">
                            <span className="text-gray-500 text-sm sm:text-base font-medium">
                                {mode === "login"
                                    ? "Don't have an account?"
                                    : "Already have an account?"}
                            </span>
                            <button
                                onClick={() => {
                                    setMode(
                                        mode === "login" ? "signup" : "login"
                                    );
                                    setError(null);
                                }}
                                className="text-gray-900 text-sm sm:text-base font-black hover:text-green-600 transition-colors"
                            >
                                {mode === "login" ? "Sign up" : "Sign in"}
                            </button>
                        </div>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                        {[
                            {
                                icon: Lock,
                                label: "Encrypted",
                                color: "text-green-600",
                            },
                            {
                                icon: Users,
                                label: "2,400+ students",
                                color: "text-green-600",
                            },
                            {
                                icon: Check,
                                label: "Free forever",
                                color: "text-green-600",
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-2 text-sm sm:text-base text-gray-400 font-bold"
                            >
                                <item.icon
                                    size={14}
                                    className={item.color}
                                />
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right: Visual Panel ── */}
            <div className="hidden lg:flex flex-1 bg-gray-900 border-l-[3px] border-gray-900 relative overflow-hidden items-center justify-center">
                <GridPattern className="text-white/[0.03]" />

                {/* Doodles */}
                <DoodleStar className="absolute top-12 right-12 w-8 h-8 text-green-500/25 rotate-12" />
                <DoodleStar className="absolute bottom-20 left-10 w-6 h-6 text-green-500/20 -rotate-6" />
                <DoodleZigzag className="absolute bottom-10 right-16 w-20 text-green-500/15" />
                <DoodleCircle className="absolute top-20 left-12 w-12 h-12 text-green-500/15" />
                <DoodleArrow className="absolute top-[40%] right-10 w-14 text-green-500/15 -rotate-12" />
                <DoodleCross className="absolute bottom-[35%] left-16 w-5 h-5 text-green-500/15" />
                <DoodleSpring className="absolute top-[30%] left-[15%] w-5 h-auto text-green-500/10" />

                <div className="relative z-10 max-w-md px-8 xl:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {/* Icon */}
                        <div className="w-14 h-14 xl:w-16 xl:h-16 bg-green-600 rounded-xl border-2 border-green-500 flex items-center justify-center mb-8 xl:mb-10 shadow-[4px_4px_0px_rgba(255,255,255,0.15)]">
                            <Sparkles
                                className="text-white"
                                size={26}
                            />
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl xl:text-4xl font-black text-white mb-5 leading-[1.1] tracking-tight">
                            Your academic
                            <br />
                            life,{" "}
                            <span className="relative inline-block">
                                connected
                                <HandDrawnUnderline className="absolute -bottom-1 left-0 w-full h-3 text-green-500" />
                            </span>
                            <span className="text-green-500">.</span>
                        </h2>

                        <p className="text-white/50 text-base xl:text-lg leading-relaxed mb-10 xl:mb-12 font-medium">
                            Courses, profs, resources, and the people who make
                            university worth it — all in one spot.
                        </p>

                        {/* Testimonial card */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="p-5 xl:p-6 bg-white/[0.05] rounded-xl border-2 border-white/10 mb-8 xl:mb-10 hover:border-green-500/30 transition-colors"
                        >
                            <p className="text-white/60 text-base leading-relaxed mb-5 font-medium">
                                &ldquo;Found my study group and a mentor in week
                                one. Uni hits different when people have your
                                back.&rdquo;
                            </p>
                            <div className="border-t-2 border-dashed border-white/10 pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-600 border-2 border-green-500 flex items-center justify-center text-sm font-black text-white">
                                        EN
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white/80">
                                            Emily Nguyen
                                        </p>
                                        <p className="text-xs text-white/30 font-bold">
                                            Biology &middot; 4th Year
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 xl:gap-4">
                            {[
                                {
                                    val: "2.4k+",
                                    label: "Students",
                                    icon: Users,
                                },
                                {
                                    val: "150+",
                                    label: "Rooms",
                                    icon: BookOpen,
                                },
                                {
                                    val: "94%",
                                    label: "Recommend",
                                    icon: Star,
                                },
                            ].map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.7 + i * 0.1,
                                        duration: 0.4,
                                    }}
                                    className="p-3 xl:p-4 bg-white/[0.04] rounded-xl border-2 border-white/10"
                                >
                                    <s.icon
                                        size={14}
                                        className="text-green-500 mb-2"
                                    />
                                    <div className="text-xl xl:text-2xl font-black text-white tracking-tight tabular-nums">
                                        {s.val}
                                    </div>
                                    <div className="text-white/30 text-sm mt-0.5 font-bold">
                                        {s.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Bottom CTA text */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="mt-8 xl:mt-10 flex items-center gap-2"
                        >
                            <Zap
                                size={14}
                                className="text-green-500"
                            />
                            <span className="text-white/30 text-sm font-bold">
                                Join 2,400+ students already on kampus
                            </span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
