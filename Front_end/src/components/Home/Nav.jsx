import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap, Bell, Menu, X,
  User, ChevronDown, LogOut, Users,
  Calendar, MessageCircle, BarChart3, CreditCard, UserCircle
} from "lucide-react";

const navLinks = [
  { label: "Teachers", icon: Users, href: "/dashboard/teachers" },
  { label: "Notices", icon: Bell, href: "/dashboard/notices" },
  { label: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
  { label: "Discuss", icon: MessageCircle, href: "/dashboard/posts" },
  { label: "Results", icon: BarChart3, href: "/dashboard/results" },
];

export default function Nav({ student, onLogout }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-sm border-[#E7E4DB]"
            : "bg-white/85 backdrop-blur-md border-transparent"
        }`}
      >
        <div className="h-[3px] w-full bg-[#1F2440]" />

        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/dashboard" className="flex items-center gap-2.5 shrink-0">
              <motion.div
                className="w-9 h-9 rounded-lg bg-[#1F2440] flex items-center justify-center"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <GraduationCap className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />
              </motion.div>
              <div className="hidden sm:block leading-tight">
                <h1 className="font-serif-display text-base font-semibold text-[#1F2440]">
                  StudyBuddy
                </h1>
              </div>
            </a>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-[#1F2440] bg-[#1F2440]/[0.06]"
                        : "text-gray-500 hover:text-[#1F2440] hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="navTab"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#9C8054] rounded-full"
                      />
                    )}
                  </motion.a>
                );
              })}
            </div>

            {/* Right section */}
            <div className="flex items-center gap-1.5">
              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Bell className="w-[18px] h-[18px] text-gray-500 group-hover:text-[#1F2440] transition-colors" strokeWidth={1.75} />
                </motion.div>
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#9C8054] rounded-full" />
              </motion.button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#1F2440] flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" strokeWidth={1.75} />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {student?.name || "Student"}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl shadow-black/5 border border-[#E7E4DB] py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-[#1F2440]">{student?.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Class {student?.class} &middot; Roll {student?.roll_number}</p>
                    </div>
                    <div className="py-1">
                      <a href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        <UserCircle className="w-4 h-4" strokeWidth={1.75} /> My Profile
                      </a>
                      <a href="/dashboard/fees" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        <CreditCard className="w-4 h-4" strokeWidth={1.75} /> Fees
                      </a>
                    </div>
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" strokeWidth={1.75} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-[calc(4rem+3px)] left-0 right-0 bg-white border-b border-[#E7E4DB] shadow-xl">
            <div className="p-4 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive ? "text-[#1F2440] bg-[#1F2440]/[0.06]" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-[calc(4rem+3px)]" />
    </>
  );
}
