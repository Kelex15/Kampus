"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
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
  Loader2,
  Check,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import PageShell from "@/components/shared/PageShell";
import { listSchoolsAction, fetchSchoolByIdAction, updateProfileSchoolAction, type School } from "@/app/actions/profile";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolName, setSchoolName] = useState<string>("—");
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null);
  const [savingSchool, setSavingSchool] = useState(false);
  const [schoolSaved, setSchoolSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    listSchoolsAction().then(setSchools);
  }, []);

  useEffect(() => {
    if (!profile?.school_id) return;
    setSelectedSchoolId(profile.school_id);
    fetchSchoolByIdAction(profile.school_id).then((s) => setSchoolName(s?.name ?? "—"));
  }, [profile?.school_id]);

  async function handleSaveSchool() {
    if (!user || !selectedSchoolId) return;
    setSavingSchool(true);
    const { error } = await updateProfileSchoolAction(user.id, selectedSchoolId);
    setSavingSchool(false);
    if (!error) {
      setSchoolSaved(true);
      const s = schools.find((s) => s.id === selectedSchoolId);
      if (s) setSchoolName(s.name);
      setTimeout(() => setSchoolSaved(false), 2000);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <PageShell>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-green-600" size={32} />
        </div>
      </PageShell>
    );
  }

  if (!user) return null;

  const firstName = profile?.first_name ?? "";
  const lastName = profile?.last_name ?? "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const username = profile?.username ?? user.email?.split("@")[0] ?? "user";
  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : username[0]?.toUpperCase() || "K";

  const accountItems = [
    { label: "Email", value: user.email ?? "—", icon: Mail },
    { label: "University", value: schoolName, icon: GraduationCap },
    { label: "Year", value: profile?.current_year ? `Year ${profile.current_year}` : "—", icon: Calendar },
    { label: "Username", value: `@${username}`, icon: User },
  ];

  const quickActions = [
    { icon: BookOpen, title: "Browse Courses", desc: "Discover rooms", href: "/dashboard", active: true },
    { icon: Users, title: "My Rooms", desc: "Coming soon", href: "#", active: false },
    { icon: BarChart3, title: "My Stats", desc: "Coming soon", href: "#", active: false },
    { icon: Settings, title: "Settings", desc: "Coming soon", href: "#", active: false },
  ];

  return (
    <PageShell>
      <main className="min-h-screen pt-16 lg:pt-20">
        {/* Header */}
        <section className="relative overflow-hidden bg-green-50 border-b-[3px] border-gray-900">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.15]"
            style={{ backgroundImage: "radial-gradient(circle, #9ca3af 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-900 rounded-xl border-2 border-gray-900 flex items-center justify-center shadow-[6px_6px_0px_#16a34a]">
                  <span className="text-green-500 font-black text-3xl sm:text-4xl">{initials}</span>
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-600 border-2 border-gray-900 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors shadow-[2px_2px_0px_#111827]">
                  <Edit3 size={12} className="text-white" />
                </button>
              </div>

              {/* Info */}
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-gray-900 rounded-full text-xs font-black text-gray-900 uppercase tracking-widest mb-4 shadow-[2px_2px_0px_#16a34a]">
                  <Zap size={12} className="text-green-600" />
                  Member
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-2">
                  {fullName || username}
                </h1>
                <p className="text-base sm:text-lg text-gray-500 font-bold">@{username}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-5">
                  {[
                    { icon: BookOpen, label: "0 courses" },
                    { icon: Star, label: "New member" },
                    { icon: Users, label: profile?.current_year ? `Year ${profile.current_year}` : "Student" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-gray-900 rounded-lg text-sm font-bold text-gray-900">
                      <stat.icon size={14} className="text-green-600" />
                      {stat.label}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="relative bg-white">
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-4 sm:space-y-5">

            {/* Account Info */}
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
                    <div
                      key={i}
                      className="flex items-center justify-between py-3.5 px-3 sm:px-4 rounded-lg hover:bg-green-50 transition-colors group -mx-1"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 border-2 border-gray-200 group-hover:border-green-600 group-hover:bg-green-50 rounded-lg flex items-center justify-center transition-all">
                          <Icon size={16} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                        </div>
                        <span className="text-sm sm:text-base text-gray-500 font-bold">{item.label}</span>
                      </div>
                      <span className="text-sm sm:text-base font-black text-gray-900 truncate max-w-[50%] text-right">{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* School picker */}
            {schools.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="bg-white border-2 border-gray-900 rounded-xl p-5 sm:p-7 shadow-[5px_5px_0px_#16a34a]"
              >
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
                    <GraduationCap size={12} className="text-white" />
                  </div>
                  Change University
                </h3>
                <div className="flex gap-3">
                  <select
                    value={selectedSchoolId ?? ""}
                    onChange={(e) => { setSelectedSchoolId(Number(e.target.value)); setSchoolSaved(false); }}
                    className="flex-1 px-4 py-3 bg-white border-2 border-gray-900 rounded-xl text-base text-gray-900 font-medium focus:outline-none focus-visible:ring-4 focus-visible:ring-green-600/20 focus-visible:border-green-600 cursor-pointer transition-all"
                  >
                    <option value="" disabled>Select your university</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleSaveSchool}
                    disabled={savingSchool || selectedSchoolId === profile?.school_id}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white font-bold rounded-xl border-2 border-gray-900 hover:shadow-[3px_3px_0px_#16a34a] hover:-translate-x-[1px] hover:-translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all"
                  >
                    {savingSchool ? <Loader2 size={16} className="animate-spin" /> : schoolSaved ? <Check size={16} className="text-green-400" /> : "Save"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
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
                  const card = (
                    <div className={`p-4 sm:p-5 rounded-xl border-2 text-center transition-all duration-200 h-full ${item.active ? "border-gray-900 bg-white hover:shadow-[4px_4px_0px_#16a34a] hover:-translate-x-[2px] hover:-translate-y-[2px] cursor-pointer group" : "border-dashed border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed"}`}>
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all ${item.active ? "bg-green-50 border-2 border-green-600/30 group-hover:bg-green-600 group-hover:border-green-600" : "bg-gray-100 border-2 border-gray-200"}`}>
                        <Icon size={22} className={item.active ? "text-green-600 group-hover:text-white transition-colors" : "text-gray-400"} />
                      </div>
                      <p className={`text-sm sm:text-base font-black mb-1 ${item.active ? "text-gray-900" : "text-gray-500"}`}>{item.title}</p>
                      <p className="text-xs sm:text-sm font-bold text-gray-400">{item.desc}</p>
                      {item.active && (
                        <div className="mt-3 flex items-center justify-center gap-1 text-xs font-black text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          Open <ArrowUpRight size={12} />
                        </div>
                      )}
                    </div>
                  );
                  return item.active ? (
                    <Link key={i} href={item.href}>{card}</Link>
                  ) : (
                    <div key={i}>{card}</div>
                  );
                })}
              </div>
            </motion.div>

            {/* Sign Out */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white border-2 border-gray-900 rounded-xl p-4 sm:p-5 shadow-[5px_5px_0px_#16a34a]"
            >
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 border-transparent hover:border-red-300 hover:bg-red-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 border-2 border-red-200 group-hover:bg-red-500 group-hover:border-red-500 rounded-lg flex items-center justify-center transition-all">
                    <LogOut size={16} className="text-red-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-left">
                    <p className="text-base font-black text-red-600">Log out</p>
                    <p className="text-sm text-gray-400 font-bold">You can always sign back in</p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-red-300 group-hover:text-red-500 transition-colors" />
              </button>
            </motion.div>

          </div>
        </section>
      </main>
    </PageShell>
  );
}
