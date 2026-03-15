"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import PageShell from "@/components/shared/PageShell";
import {
  LogOut,
  ArrowUpRight,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Mail,
  GraduationCap,
  Calendar,
  User,
  Zap,
  Star,
  Edit3,
} from "lucide-react";
import Link from "next/link";

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

/* ─── Main Component ─── */

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  if (loading) return null;
  if (!user) {
    router.push("/login");
    return null;
  }

  const firstName = profile?.first_name ?? "";
  const lastName = profile?.last_name ?? "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const username = profile?.username ?? user.email?.split("@")[0] ?? "user";

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : username[0]?.toUpperCase() || "K";

  const accountItems = [
    {
      label: "Email",
      value: user.email ?? "—",
      icon: Mail,
    },
    {
      label: "University",
      value: profile?.school_id ? `School #${profile.school_id}` : "—",
      icon: GraduationCap,
    },
    {
      label: "Year",
      value: profile?.current_year ? `Year ${profile.current_year}` : "—",
      icon: Calendar,
    },
    {
      label: "Username",
      value: `@${username}`,
      icon: User,
    },
  ];

  const quickActions = [
    {
      icon: BookOpen,
      title: "Browse Courses",
      desc: "Discover rooms",
      href: "/dashboard",
      active: true,
    },
    {
      icon: Users,
      title: "My Rooms",
      desc: "Coming soon",
      href: "#",
      active: false,
    },
    {
      icon: BarChart3,
      title: "My Stats",
      desc: "Coming soon",
      href: "#",
      active: false,
    },
    {
      icon: Settings,
      title: "Settings",
      desc: "Coming soon",
      href: "#",
      active: false,
    },
  ];

  return (
    <PageShell>
      <main className="min-h-screen pt-16 lg:pt-20">
        {/* ═══════════════════════════════
            PROFILE HEADER
        ═══════════════════════════════ */}
        <section className="relative overflow-hidden bg-green-50 border-b-[3px] border-gray-900">
          <DotGrid className="opacity-[0.15]" />

          {/* Doodles */}
          <DoodleStar className="absolute top-8 right-6 sm:right-16 w-7 h-7 sm:w-9 sm:h-9 text-green-600/40 rotate-12" />
          <DoodleCircle className="absolute top-12 right-32 sm:right-48 w-10 h-10 sm:w-14 sm:h-14 text-green-600/20 hidden sm:block" />
          <DoodleZigzag className="absolute bottom-6 right-8 sm:right-20 w-16 sm:w-24 text-green-600/20 hidden lg:block" />
          <DoodleCross className="absolute top-20 left-[55%] w-5 h-5 text-green-600/15 hidden md:block" />
          <DoodleArrow className="absolute bottom-10 left-6 sm:left-16 w-14 sm:w-20 text-green-600/25 rotate-6 hidden sm:block" />
          <DoodleSpring className="absolute top-6 right-[22%] w-5 h-auto text-green-600/15 hidden xl:block" />
          <DoodleStar className="absolute bottom-8 left-[35%] w-5 h-5 text-green-600/20 -rotate-12 hidden lg:block" />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-900 rounded-xl border-2 border-gray-900 flex items-center justify-center shadow-[6px_6px_0px_#16a34a]">
                  <span className="text-green-500 font-black text-3xl sm:text-4xl">
                    {initials}
                  </span>
                </div>
                <DoodleStar className="absolute -top-2 -right-2 w-5 h-5 text-green-600/50 rotate-12" />
                {/* Edit badge */}
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-600 border-2 border-gray-900 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors shadow-[2px_2px_0px_#111827]">
                  <Edit3 size={12} className="text-white" />
                </button>
              </div>

              {/* Info */}
              <div className="text-center sm:text-left">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.1,
                    duration: 0.4,
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-gray-900 rounded-full text-xs font-black text-gray-900 uppercase tracking-widest mb-4 shadow-[2px_2px_0px_#16a34a]"
                >
                  <Zap size={12} className="text-green-600" />
                  Member
                </motion.div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-2">
                  {fullName || username}
                </h1>
                <p className="text-base sm:text-lg text-gray-500 font-bold">
                  @{username}
                </p>

                {/* Mini stats */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-5">
                  {[
                    {
                      icon: BookOpen,
                      label: "0 courses",
                    },
                    { icon: Star, label: "New member" },
                    {
                      icon: Users,
                      label: profile?.current_year
                        ? `Year ${profile.current_year}`
                        : "Student",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-gray-900 rounded-lg text-sm font-bold text-gray-900"
                    >
                      <stat.icon size={14} className="text-green-600" />
                      {stat.label}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════
            CONTENT
        ═══════════════════════════════ */}
        <section className="relative bg-white">
          <DotGrid className="opacity-[0.04]" />

          <DoodleStar className="absolute top-10 right-10 w-6 h-6 text-green-600/10 rotate-45 hidden lg:block" />
          <DoodleCross className="absolute top-40 left-8 w-4 h-4 text-green-600/10 rotate-12 hidden lg:block" />
          <DoodleCircle className="absolute bottom-20 right-16 w-8 h-8 text-green-600/10 hidden lg:block" />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 space-y-4 sm:space-y-5">
            {/* ── Account Info Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white border-2 border-gray-900 rounded-xl p-5 sm:p-7 shadow-[5px_5px_0px_#16a34a]"
            >
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
                  <User size={12} className="text-white" />
                </div>
                Account
              </h3>

              <div className="space-y-1">
                {accountItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.15 + i * 0.06,
                        duration: 0.35,
                      }}
                      className="flex items-center justify-between py-3.5 px-3 sm:px-4 rounded-lg hover:bg-green-50 transition-colors group -mx-1"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 border-2 border-gray-200 group-hover:border-green-600 group-hover:bg-green-50 rounded-lg flex items-center justify-center transition-all">
                          <Icon
                            size={16}
                            className="text-gray-400 group-hover:text-green-600 transition-colors"
                          />
                        </div>
                        <span className="text-sm sm:text-base text-gray-500 font-bold">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-sm sm:text-base font-black text-gray-900 truncate max-w-[50%] text-right">
                        {item.value}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* ── Quick Actions Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white border-2 border-gray-900 rounded-xl p-5 sm:p-7 shadow-[5px_5px_0px_#16a34a]"
            >
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
                  <Zap size={12} className="text-white" />
                </div>
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {quickActions.map((item, i) => {
                  const Icon = item.icon;
                  const content = (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.25 + i * 0.06,
                        duration: 0.35,
                      }}
                    >
                      <div
                        className={`p-4 sm:p-5 rounded-xl border-2 text-center transition-all duration-200 h-full ${
                          item.active
                            ? "border-gray-900 bg-white hover:shadow-[4px_4px_0px_#16a34a] hover:-translate-x-[2px] hover:-translate-y-[2px] cursor-pointer group"
                            : "border-dashed border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all ${
                            item.active
                              ? "bg-green-50 border-2 border-green-600/30 group-hover:bg-green-600 group-hover:border-green-600"
                              : "bg-gray-100 border-2 border-gray-200"
                          }`}
                        >
                          <Icon
                            size={22}
                            className={
                              item.active
                                ? "text-green-600 group-hover:text-white transition-colors"
                                : "text-gray-400"
                            }
                          />
                        </div>
                        <p
                          className={`text-sm sm:text-base font-black mb-1 ${
                            item.active ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p
                          className={`text-xs sm:text-sm font-bold ${
                            item.active ? "text-gray-400" : "text-gray-400"
                          }`}
                        >
                          {item.desc}
                        </p>
                        {item.active && (
                          <div className="mt-3 flex items-center justify-center gap-1 text-xs font-black text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            Open
                            <ArrowUpRight size={12} />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );

                  return item.active ? (
                    <Link key={i} href={item.href}>
                      {content}
                    </Link>
                  ) : (
                    <div key={i}>{content}</div>
                  );
                })}
              </div>
            </motion.div>

            {/* ── Activity / Placeholder Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-gray-900 border-2 border-gray-900 rounded-xl p-5 sm:p-7 relative overflow-hidden"
            >
              <GridPattern className="text-white/[0.04]" />

              <DoodleStar className="absolute top-4 right-5 w-5 h-5 text-green-500/20 rotate-12" />
              <DoodleCircle className="absolute bottom-4 right-16 w-7 h-7 text-green-500/15 hidden sm:block" />

              <div className="relative">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
                    <Star size={12} className="text-white" />
                  </div>
                  Activity
                </h3>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="w-14 h-14 bg-green-600 border-2 border-green-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[3px_3px_0px_rgba(255,255,255,0.1)]">
                    <Zap size={22} className="text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="text-lg sm:text-xl font-black text-white mb-1">
                      Your journey starts here
                    </h4>
                    <p className="text-white/50 text-sm sm:text-base font-medium leading-relaxed mb-4">
                      Join your first course room to start building your
                      academic network. Activity and stats will appear here.
                    </p>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-lg border-2 border-green-500 hover:bg-green-700 hover:border-green-700 transition-all shadow-[3px_3px_0px_rgba(255,255,255,0.1)]"
                    >
                      Browse courses
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Logout Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white border-2 border-gray-900 rounded-xl p-4 sm:p-5 shadow-[5px_5px_0px_#16a34a]"
            >
              <button
                onClick={async () => {
                  await signOut();
                  router.push("/");
                }}
                className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 border-transparent hover:border-red-300 hover:bg-red-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 border-2 border-red-200 group-hover:bg-red-500 group-hover:border-red-500 rounded-lg flex items-center justify-center transition-all">
                    <LogOut
                      size={16}
                      className="text-red-500 group-hover:text-white transition-colors"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-base font-black text-red-600">
                      Log out
                    </p>
                    <p className="text-sm text-gray-400 font-bold">
                      You can always sign back in
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg border-2 border-transparent group-hover:border-red-300 flex items-center justify-center transition-all">
                  <ArrowUpRight
                    size={16}
                    className="text-red-300 group-hover:text-red-500 transition-colors"
                  />
                </div>
              </button>
            </motion.div>

            {/* ── Bottom Invite Strip ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-green-600 border-2 border-gray-900 rounded-xl p-5 sm:p-7 shadow-[5px_5px_0px_#111827] flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-black text-white mb-1">
                  Invite your classmates
                </h3>
                <p className="text-white/70 text-sm sm:text-base font-medium">
                  Kampus is better with friends. Share your link!
                </p>
              </div>
              <button className="px-5 py-3 bg-white text-gray-900 font-bold text-sm rounded-lg border-2 border-gray-900 hover:shadow-[3px_3px_0px_#111827] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all flex-shrink-0 flex items-center gap-2">
                Copy invite link
                <ArrowUpRight size={14} />
              </button>
            </motion.div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
