import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const events = [
  { id: 1, title: "Mid-term Exams Start", date: "2026-08-25", type: "exam", color: "#A6402F" },
  { id: 2, title: "Science Fair", date: "2026-09-05", type: "event", color: "#5B5A8C" },
  { id: 3, title: "Parent-Teacher Meeting", date: "2026-09-12", type: "meeting", color: "#4B7A5A" },
  { id: 4, title: "Sports Day", date: "2026-09-20", type: "event", color: "#9C8054" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function UpcomingEvents() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl p-5 md:p-6 border border-[#E7E4DB]"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif-display text-base font-semibold text-[#1F2440]">
          Upcoming Events
        </h2>
        <a href="/dashboard/calendar" className="text-xs font-semibold text-[#9C8054] hover:text-[#1F2440] flex items-center gap-1 transition-colors">
          View Calendar <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-1">
        {events.map((event) => (
          <motion.a
            href="/dashboard/calendar"
            key={event.id}
            variants={item}
            className="flex items-center gap-3 p-2.5 -mx-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Date badge */}
            <div className="w-11 h-11 rounded-lg bg-[#FAF9F6] border border-[#E7E4DB] flex flex-col items-center justify-center shrink-0">
              <span className="text-[9px] font-semibold text-gray-400 uppercase">
                {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
              </span>
              <span className="font-serif-display text-sm font-semibold text-[#1F2440]">
                {new Date(event.date).getDate()}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{event.title}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: event.color }} />
                <span className="text-xs text-gray-400 capitalize">{event.type}</span>
              </div>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  );
}
