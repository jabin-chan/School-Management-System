import { motion } from "framer-motion";
import { Pin, ChevronRight, Sparkles } from "lucide-react";

const categoryConfig = {
  general: { color: "#1F2440", label: "General", emoji: "📋" },
  exam: { color: "#A6402F", label: "Exam", emoji: "📝" },
  admission: { color: "#4B7A5A", label: "Admission", emoji: "🎓" },
  holiday: { color: "#9C8054", label: "Holiday", emoji: "🎉" },
  event: { color: "#5B5A8C", label: "Event", emoji: "✨" },
  urgent: { color: "#A6402F", label: "Urgent", emoji: "🚨" },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function NoticeCard({ notice, onClick, index = 0 }) {
  const cat = categoryConfig[notice.category] || categoryConfig.general;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.06, type: "spring", stiffness: 200 }}
      whileHover={{ y: -6, scale: 1.01, transition: { type: "spring", stiffness: 400, damping: 15 } }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(notice)}
      className="group bg-white rounded-xl border border-[#E7E4DB] border-b-[3px] overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(31,36,64,0.1)]"
      style={{ borderBottomColor: cat.color }}
    >
      <div className="p-6">
        {/* Top row - category + date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-base"
              whileHover={{ scale: 1.3, rotate: 15 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {cat.emoji}
            </motion.span>
            <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: cat.color }}>
              {cat.label}
            </span>
            {notice.is_pinned && (
              <motion.span
                className="flex items-center gap-1 text-xs text-[#9C8054] font-medium"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Pin className="w-3 h-3 fill-current" />
                Pinned
              </motion.span>
            )}
          </div>
          <span className="text-xs text-gray-400">{formatDate(notice.created_at)}</span>
        </div>

        {/* Title */}
        <h3 className="font-serif-display text-lg font-semibold text-[#1F2440] mb-2 leading-snug group-hover:text-[#9C8054] transition-colors duration-300">
          {notice.title}
        </h3>

        {/* Content preview */}
        {notice.content && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
            {notice.content}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {notice.expires_at ? (
            <span className="text-xs text-gray-400">Expires {formatDate(notice.expires_at)}</span>
          ) : <span />}
          <motion.span
            className="flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-[#1F2440] transition-colors"
            whileHover={{ x: 4 }}
          >
            Read more
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
