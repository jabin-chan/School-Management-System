import { motion } from "framer-motion";
import { Bell, ChevronRight, Pin, Calendar, AlertTriangle, Info } from "lucide-react";

const categoryConfig = {
  general: { color: "#1F2440", icon: Info },
  exam: { color: "#A6402F", icon: AlertTriangle },
  admission: { color: "#4B7A5A", icon: Bell },
  holiday: { color: "#9C8054", icon: Calendar },
  event: { color: "#5B5A8C", icon: Bell },
  urgent: { color: "#A6402F", icon: AlertTriangle },
};

const notices = [
  { id: 1, title: "Mid-term Examination Schedule Released", category: "exam", is_pinned: true, created_at: "2026-08-10" },
  { id: 2, title: "Science Fair 2026 - Register Now!", category: "event", is_pinned: false, created_at: "2026-08-09" },
  { id: 3, title: "Holiday Notice - Independence Day", category: "holiday", is_pinned: false, created_at: "2026-08-08" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function RecentNotices() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl p-5 md:p-6 border border-[#E7E4DB]"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif-display text-base font-semibold text-[#1F2440]">
          Recent Notices
        </h2>
        <a href="/dashboard/notices" className="text-xs font-semibold text-[#9C8054] hover:text-[#1F2440] flex items-center gap-1 transition-colors">
          View All <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-1">
        {notices.map((notice) => {
          const cat = categoryConfig[notice.category] || categoryConfig.general;
          const CatIcon = cat.icon;
          return (
            <motion.a
              href="/dashboard/notices"
              key={notice.id}
              variants={item}
              className="flex items-start gap-3 p-2.5 -mx-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-1.5 rounded-md shrink-0 mt-0.5" style={{ backgroundColor: cat.color + "14" }}>
                <CatIcon className="w-3.5 h-3.5" style={{ color: cat.color }} strokeWidth={1.75} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {notice.is_pinned && <Pin className="w-2.5 h-2.5 text-[#9C8054] fill-[#9C8054]" />}
                  <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: cat.color }}>
                    {notice.category}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-700 truncate">{notice.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{notice.created_at}</p>
              </div>
            </motion.a>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
