import { motion, AnimatePresence } from "framer-motion";
import { X, Pin, Download, Share2 } from "lucide-react";

const categoryConfig = {
  general: { color: "#1F2440", label: "General" },
  exam: { color: "#A6402F", label: "Exam" },
  admission: { color: "#4B7A5A", label: "Admission" },
  holiday: { color: "#9C8054", label: "Holiday" },
  event: { color: "#5B5A8C", label: "Event" },
  urgent: { color: "#A6402F", label: "Urgent" },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export default function NoticeDetail({ notice, onClose }) {
  if (!notice) return null;
  const cat = categoryConfig[notice.category] || categoryConfig.general;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-[#1F2440]/40 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col border-t-[3px]"
          style={{ borderTopColor: cat.color, boxShadow: "0 20px 60px rgba(31,36,64,0.2)" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: cat.color }}>
                {cat.label}
              </span>
              {notice.is_pinned && (
                <span className="flex items-center gap-1 text-xs text-[#9C8054] font-medium">
                  <Pin className="w-3 h-3 fill-current" />
                  Pinned
                </span>
              )}
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="font-serif-display text-xl font-semibold text-[#1F2440] mb-3 leading-snug">
              {notice.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
              <span>{formatDate(notice.created_at)}</span>
              {notice.expires_at && <span>Expires {formatDate(notice.expires_at)}</span>}
            </div>

            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {notice.content || "No content available."}
            </div>

            {notice.attachment_url && (
              <a
                href={`http://localhost:5000${notice.attachment_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-6 p-4 rounded-xl bg-[#FAF9F6] hover:bg-gray-100 text-sm font-medium text-gray-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Attachment
              </a>
            )}

            {/* Head Teacher Signature */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <div className="text-right">
                <div className="mb-1">
                  <span
                    className="font-serif-display text-lg italic text-[#1F2440]"
                    style={{ fontFamily: "'Dancing Script', cursive, serif" }}
                  >
                    Rafiqul Islam
                  </span>
                </div>
                <div className="w-32 h-px bg-[#1F2440]/30 ml-auto mb-1" />
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Head Teacher</p>
                <p className="text-[10px] text-gray-300 mt-0.5">StudyBuddy School</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
            <button
              onClick={() => {
                if (navigator.share) navigator.share({ title: notice.title, text: notice.content });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#1F2440] text-white hover:bg-[#2C3359] transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
