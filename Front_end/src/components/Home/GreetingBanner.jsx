import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function GreetingBanner({ studentName }) {
  const greeting = getGreeting();
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-[#1F2440] p-7 md:p-9 border-b-[3px] border-b-[#9C8054]"
    >
      {/* Decorative element */}
      <GraduationCap className="absolute -right-4 -top-6 w-44 h-44 text-white/[0.05]" strokeWidth={1} />

      <div className="relative z-10">
        <p className="text-[#B79B6B] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
          {today}
        </p>
        <h1 className="font-serif-display text-2xl md:text-3xl font-semibold text-white mb-1.5">
          {greeting}, {studentName || "Student"}
        </h1>
        <p className="text-white/60 text-sm md:text-base">
          Ready to learn something new today?
        </p>
      </div>
    </motion.div>
  );
}
