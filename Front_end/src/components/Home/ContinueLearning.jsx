import { motion } from "framer-motion";
import { Play, ChevronRight, Clock } from "lucide-react";

export default function ContinueLearning() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-xl p-5 md:p-6 border border-[#E7E4DB]"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif-display text-base font-semibold text-[#1F2440]">
          Continue Learning
        </h2>
        <button className="text-xs font-semibold text-[#9C8054] hover:text-[#1F2440] flex items-center gap-1 transition-colors">
          View All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main continue card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="relative overflow-hidden rounded-xl bg-[#FAF9F6] p-5 md:p-6 border border-[#E7E4DB] border-l-[3px] border-l-[#1F2440]"
      >
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-12 h-12 rounded-lg bg-[#1F2440] flex items-center justify-center shrink-0">
            <Play className="w-5 h-5 text-white ml-0.5" strokeWidth={1.75} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-semibold text-[#1F2440] bg-[#1F2440]/[0.08] px-2 py-0.5 rounded-full uppercase tracking-wide">
                Class 10
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Chapter 4
              </span>
            </div>

            <h3 className="font-serif-display text-base font-semibold text-[#1F2440] mb-1">
              Introduction to Algebra
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Learn the fundamentals of algebraic expressions and equations
            </p>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Progress</span>
                <span className="font-semibold text-[#1F2440]">65%</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                  className="h-full bg-[#9C8054] rounded-full"
                />
              </div>
            </div>

            <button className="flex items-center gap-2 bg-[#1F2440] hover:bg-[#2C3359] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick progress list */}
      <div className="mt-2 space-y-1">
        {[
          { subject: "Mathematics", chapter: "Quadratic Equations", progress: 80 },
          { subject: "Physics", chapter: "Motion & Forces", progress: 45 },
          { subject: "English", chapter: "Essay Writing", progress: 30 },
        ].map((row) => (
          <div
            key={row.subject}
            className="flex items-center gap-3 p-2.5 -mx-2.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[#1F2440]/[0.05]">
              <span className="font-serif-display text-sm font-semibold text-[#1F2440]">
                {row.subject.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{row.subject}</p>
              <p className="text-xs text-gray-400 truncate">{row.chapter}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-[#9C8054]">{row.progress}%</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
