"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isAuthenticated, getAuthUser, logout } from "@/lib/api";

function HandDrawnUnderline() {
    return (
        <motion.svg
            layoutId="nav-underline"
            className="absolute -bottom-1 left-1 right-1 h-[8px] w-[calc(100%-8px)]"
            viewBox="0 0 120 10"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <motion.path
                d="M3 7C15 3 25 8 38 5 51 2 58 7.5 72 4.5 86 1.5 95 7 117 4"
                stroke="#16a34a"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
            />
        </motion.svg>
    );
}

function MobileUnderline() {
    return (
        <motion.svg
            className="absolute -bottom-0.5 left-4 right-4 h-[8px]"
            viewBox="0 0 120 10"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <motion.path
                d="M3 7C15 3 25 8 38 5 51 2 58 7.5 72 4.5 86 1.5 95 7 117 4"
                stroke="#16a34a"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
            />
        </motion.svg>
    );
}

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [authed, setAuthed] = useState(false);
    const [initials, setInitials] = useState("K");

    useEffect(() => {
        const auth = isAuthenticated();
        setAuthed(auth);
        if (auth) {
            const user = getAuthUser();
            if (user) {
                const i = user.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : user.username?.[0]?.toUpperCase() || "K";
                setInitials(i);
            }
        }
    }, [pathname]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    const links = [
        { href: "/", label: "Home" },
        { href: "/discover", label: "Discover" },
        ...(authed ? [{ href: "/profile", label: "Profile" }] : []),
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
                scrolled
                    ? "bg-white/85 backdrop-blur-2xl border-b-[3px] border-gray-900 shadow-[0_4px_0px_#16a34a33]"
                    : "bg-transparent border-b-[3px] border-transparent"
            }`}
        >
            <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] lg:h-20 flex items-center justify-between">
                {/* ── Logo ── */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-600/20 rounded-lg"
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

                {/* ── Desktop links ── */}
                <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-4 lg:px-5 py-2.5 text-base rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-600/20 ${
                                    isActive
                                        ? "text-gray-900 font-black"
                                        : "text-gray-500 hover:text-gray-900 font-bold"
                                }`}
                            >
                                {link.label}
                                {isActive && <HandDrawnUnderline />}
                            </Link>
                        );
                    })}

                    <div
                        className="w-0.5 h-7 bg-gray-900/10 mx-2 lg:mx-3 rounded-full"
                        aria-hidden
                    />

                    {authed ? (
                        <Link
                            href="/profile"
                            className="w-9 h-9 sm:w-10 sm:h-10 bg-green-600 rounded-lg border-2 border-gray-900 flex items-center justify-center hover:shadow-[3px_3px_0px_#111827] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-0 active:translate-y-0 transition-all duration-200 ml-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-600/20"
                        >
                            <span className="text-white font-black text-xs sm:text-sm leading-none">
                                {initials}
                            </span>
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-4 lg:px-5 py-2.5 text-base text-gray-500 hover:text-gray-900 rounded-lg transition-colors font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-600/20"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="ml-1 px-5 lg:px-6 py-2.5 bg-green-600 text-white text-base font-bold rounded-lg border-2 border-green-600 hover:bg-green-700 hover:border-green-700 active:scale-[0.97] transition-all duration-200 shadow-[3px_3px_0px_#111827] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-600/20"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>

                {/* ── Mobile toggle ── */}
                <button
                    className="md:hidden p-2.5 -mr-1 text-gray-900 hover:bg-gray-100 rounded-lg border-2 border-transparent hover:border-gray-900 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-600/20"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
                </button>
            </nav>

            {/* ── Mobile menu ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 top-16 sm:top-[72px] bg-black/30 md:hidden z-40"
                            onClick={() => setMobileOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{
                                duration: 0.25,
                                ease: [0.25, 0.1, 0.25, 1],
                            }}
                            className="md:hidden absolute left-3 right-3 sm:left-4 sm:right-4 mt-2 bg-white border-2 border-gray-900 rounded-xl shadow-[6px_6px_0px_#16a34a] z-50 overflow-hidden"
                        >
                            <div className="p-4 sm:p-5 space-y-1">
                                {links.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() =>
                                                setMobileOpen(false)
                                            }
                                            className={`relative block px-4 py-3.5 text-base sm:text-lg rounded-lg transition-all ${
                                                isActive
                                                    ? "text-gray-900 font-black bg-green-50 border-2 border-green-600"
                                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-bold border-2 border-transparent"
                                            }`}
                                        >
                                            {link.label}
                                            {isActive && <MobileUnderline />}
                                        </Link>
                                    );
                                })}

                                <div className="pt-4 mt-4 border-t-2 border-dashed border-gray-200">
                                    {authed ? (
                                        <button
                                            onClick={() => {
                                                logout();
                                                setMobileOpen(false);
                                                window.location.href = "/";
                                            }}
                                            className="block w-full text-left px-4 py-3.5 text-base sm:text-lg text-red-600 hover:bg-red-50 font-bold rounded-lg border-2 border-transparent hover:border-red-300 transition-all"
                                        >
                                            Log out
                                        </button>
                                    ) : (
                                        <div className="space-y-2.5">
                                            <Link
                                                href="/login"
                                                onClick={() =>
                                                    setMobileOpen(false)
                                                }
                                                className="block px-4 py-3.5 text-base sm:text-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all font-bold border-2 border-transparent hover:border-gray-900"
                                            >
                                                Log in
                                            </Link>
                                            <Link
                                                href="/signup"
                                                onClick={() =>
                                                    setMobileOpen(false)
                                                }
                                                className="block px-4 py-3.5 text-base sm:text-lg text-center bg-green-600 text-white font-bold rounded-lg border-2 border-gray-900 hover:bg-green-700 active:scale-[0.98] transition-all shadow-[3px_3px_0px_#111827]"
                                            >
                                                Sign up
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}