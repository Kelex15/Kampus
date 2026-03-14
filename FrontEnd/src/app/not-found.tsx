"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PageShell from "@/components/shared/PageShell";

export default function NotFound() {
    return (
        <PageShell>
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <div className="relative inline-block mb-8">
            <span className="text-[140px] font-bold text-[#1a1a17]/[0.03] leading-none block tracking-[-0.05em]">
              404
            </span>
                        <span className="absolute inset-0 flex items-center justify-center text-6xl">
              😵
            </span>
                    </div>

                    <h1 className="text-[28px] font-bold text-[#1a1a17] mb-3 tracking-[-0.03em]">
                        Page not found
                    </h1>
                    <p className="text-[#7a7a72] text-[15px] mb-8 max-w-xs mx-auto">
                        This page doesn&apos;t exist. Maybe it graduated already.
                    </p>

                    <div className="flex items-center justify-center gap-3">
                        <Link
                            href="/"
                            className="px-7 py-3.5 bg-[#CBFF00] text-[#1a1a17] text-[15px] font-bold rounded-full hover:bg-[#b8e600] transition-colors"
                        >
                            Go home
                        </Link>
                        <Link
                            href="/discover"
                            className="px-7 py-3.5 text-[#4a4a45] text-[15px] font-semibold rounded-full border border-[#e2e1dc] hover:border-[#d0cfc8] hover:bg-white transition-all"
                        >
                            Discover courses
                        </Link>
                    </div>
                </motion.div>
            </div>
        </PageShell>
    );
}