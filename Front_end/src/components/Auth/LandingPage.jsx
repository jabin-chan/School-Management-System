import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, UserPlus, GraduationCap, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      {/* Top accent bar */}
      <div className="h-[3px] w-full bg-[#1F2440]" />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-20">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10 sm:mb-14"
        >
          <div className="w-16 h-16 rounded-xl bg-[#1F2440] flex items-center justify-center shadow-lg shadow-[#1F2440]/20 mb-5">
            <GraduationCap className="w-8 h-8 text-white" strokeWidth={1.75} />
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#1F2440] tracking-tight">
            StudyBuddy
          </h1>
          <p className="text-[#9C8054] text-xs font-semibold tracking-[0.2em] uppercase mt-2">
            School Management System
          </p>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 w-full max-w-2xl">
          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            whileHover={{ y: -4 }}
            onClick={() => navigate("/login")}
            className="flex-1 bg-white rounded-2xl p-7 sm:p-8 border border-[#E7E4DB] border-b-[3px] border-b-[#9C8054] cursor-pointer group transition-all duration-300 shadow-[0_2px_16px_rgba(31,36,64,0.04)] hover:shadow-[0_8px_28px_rgba(31,36,64,0.08)]"
          >
            <div className="w-12 h-12 rounded-lg bg-[#1F2440]/5 flex items-center justify-center mb-5 group-hover:bg-[#1F2440] transition-colors duration-300">
              <LogIn className="w-5 h-5 text-[#1F2440] group-hover:text-white transition-colors" strokeWidth={1.75} />
            </div>
            <h2 className="font-serif-display text-lg font-semibold text-[#1F2440] mb-2">
              Existing Student
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Already enrolled? Log in with your student ID and password to access your dashboard.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[#1F2440] font-semibold text-sm">
              Log In
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Admission Card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            whileHover={{ y: -4 }}
            onClick={() => navigate("/admission")}
            className="flex-1 bg-white rounded-2xl p-7 sm:p-8 border border-[#E7E4DB] border-b-[3px] border-b-[#1F2440] cursor-pointer group transition-all duration-300 shadow-[0_2px_16px_rgba(31,36,64,0.04)] hover:shadow-[0_8px_28px_rgba(31,36,64,0.08)]"
          >
            <div className="w-12 h-12 rounded-lg bg-[#9C8054]/10 flex items-center justify-center mb-5 group-hover:bg-[#9C8054] transition-colors duration-300">
              <UserPlus className="w-5 h-5 text-[#9C8054] group-hover:text-white transition-colors" strokeWidth={1.75} />
            </div>
            <h2 className="font-serif-display text-lg font-semibold text-[#1F2440] mb-2">
              New Admission
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Applying for the first time? Fill out the admission form and wait for admin approval.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[#9C8054] font-semibold text-sm">
              Apply Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 py-6 tracking-wide">
        &copy; {new Date().getFullYear()} StudyBuddy &mdash; School Management System
      </p>
    </div>
  );
}
