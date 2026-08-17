import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Bell, BellRing, Info, AlertTriangle, Calendar, X, Sparkles } from "lucide-react";
import { useAuth } from "../Auth/AuthContext.jsx";
import Nav from "../Home/Nav.jsx";
import NoticeCard from "./NoticeCard.jsx";
import NoticeDetail from "./NoticeDetail.jsx";

const categories = [
  { key: "all", label: "All", icon: Bell },
  { key: "general", label: "General", icon: Info },
  { key: "exam", label: "Exam", icon: AlertTriangle },
  { key: "admission", label: "Admission", icon: Bell },
  { key: "holiday", label: "Holiday", icon: Calendar },
  { key: "event", label: "Event", icon: BellRing },
  { key: "urgent", label: "Urgent", icon: AlertTriangle },
];

const mockNotices = [
  {
    notice_id: 1,
    title: "Mid-term Examination Schedule Released",
    content: "The mid-term examination for all classes will commence from September 15, 2026. Students are advised to check their respective class schedules on the school portal. Hall tickets will be distributed one week before the exam. Any conflicts in the schedule must be reported to the examination cell immediately.",
    category: "exam",
    is_pinned: true,
    created_at: "2026-08-10T09:00:00",
    expires_at: "2026-09-20",
    attachment_url: null,
  },
  {
    notice_id: 2,
    title: "Science Fair 2026 - Register Now!",
    content: "We are excited to announce the annual Science Fair 2026! This year's theme is 'Innovation for Sustainability'. Students from classes 6-12 can participate individually or in teams of up to 3. Registration closes on August 30, 2026. Prizes worth BDT 50,000 will be awarded. Contact your science teacher for details.",
    category: "event",
    is_pinned: false,
    created_at: "2026-08-09T14:30:00",
    expires_at: "2026-08-30",
    attachment_url: null,
  },
  {
    notice_id: 3,
    title: "Holiday Notice - Independence Day",
    content: "The school will remain closed on August 15, 2026, on account of Independence Day. Regular classes will resume on August 16, 2026. We wish everyone a joyful celebration of our nation's independence.",
    category: "holiday",
    is_pinned: false,
    created_at: "2026-08-08T10:00:00",
    expires_at: null,
    attachment_url: null,
  },
  {
    notice_id: 4,
    title: "Admission Open for Session 2027",
    content: "Admissions for the academic session 2027 are now open for classes KG-1 through Class 11. Application forms are available at the school office and on the school website. Last date for submission is October 31, 2026. Entrance tests will be held in November. Early bird discount available for applications submitted before September 15.",
    category: "admission",
    is_pinned: true,
    created_at: "2026-08-07T08:00:00",
    expires_at: "2026-10-31",
    attachment_url: null,
  },
  {
    notice_id: 5,
    title: "Parent-Teacher Meeting Scheduled",
    content: "A Parent-Teacher Meeting is scheduled for August 23, 2026 (Saturday) from 9:00 AM to 1:00 PM. Parents are requested to collect their child's progress report and discuss academic performance with the respective class teachers. Please bring your student ID card copy for verification.",
    category: "general",
    is_pinned: false,
    created_at: "2026-08-06T11:00:00",
    expires_at: "2026-08-23",
    attachment_url: null,
  },
  {
    notice_id: 6,
    title: "Urgent: Water Supply Maintenance",
    content: "Due to essential maintenance of the water supply system, there will be no water availability in the school building on August 18, 2026. Students are advised to bring water bottles from home. The canteen will operate with limited services. We apologize for the inconvenience.",
    category: "urgent",
    is_pinned: false,
    created_at: "2026-08-05T16:00:00",
    expires_at: "2026-08-18",
    attachment_url: null,
  },
  {
    notice_id: 7,
    title: "Library Hours Extended for Exam Prep",
    content: "The school library will remain open until 5:00 PM (instead of the usual 3:30 PM) from August 20 to September 14, 2026, to support students preparing for mid-term examinations. Additional reference materials and past papers have been made available.",
    category: "general",
    is_pinned: false,
    created_at: "2026-08-04T09:30:00",
    expires_at: "2026-09-14",
    attachment_url: null,
  },
  {
    notice_id: 8,
    title: "Sports Day 2026 - Volunteer Registration",
    content: "Annual Sports Day will be held on September 5, 2026. We need student volunteers for event management, first aid, and commentary. Register with the sports department by August 25. Participants in track and field events must submit medical fitness certificates.",
    category: "event",
    is_pinned: false,
    created_at: "2026-08-03T13:00:00",
    expires_at: "2026-09-05",
    attachment_url: null,
  },
];

export default function Notices() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedNotice, setSelectedNotice] = useState(null);

  const student = user?.student || null;
  const handleLogout = async () => { await logout(); navigate("/login"); };

  const filtered = mockNotices.filter((n) => {
    const matchCat = activeCategory === "all" || n.category === activeCategory;
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const pinned = filtered.filter((n) => n.is_pinned);
  const others = filtered.filter((n) => !n.is_pinned);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav student={student} onLogout={handleLogout} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-[#1F2440] rounded-2xl p-10 md:p-14 overflow-hidden mb-10 border-b-[3px] border-b-[#9C8054]"
        >
          {/* Floating decorative elements */}
          <motion.div
            className="absolute top-4 right-8 text-white/10"
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Bell className="w-20 h-20" />
          </motion.div>
          <motion.div
            className="absolute bottom-4 right-24 text-white/5"
            animate={{ y: [0, 8, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Sparkles className="w-16 h-16" />
          </motion.div>

          <div className="relative z-10 max-w-2xl">
            <motion.p
              className="text-[#B79B6B] text-xs font-semibold tracking-[0.2em] uppercase mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Announcements
            </motion.p>
            <motion.h1
              className="font-serif-display text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Notices &amp; <span className="italic text-[#B79B6B]">Updates</span>
            </motion.h1>
            <motion.p
              className="text-white/60 text-base leading-relaxed max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Stay informed with the latest announcements, events, and important dates from the school administration.
            </motion.p>
          </div>
        </motion.div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#1F2440] focus:ring-2 focus:ring-[#1F2440]/10 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            const CatIcon = cat.icon;
            return (
              <motion.button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? "text-[#1F2440]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <CatIcon className="w-3.5 h-3.5" />
                {cat.label}
                {isActive && (
                  <motion.span layoutId="noticeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9C8054] rounded-full" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Pinned notices */}
        {pinned.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">Pinned</h2>
            <div className="space-y-4">
              {pinned.map((notice, i) => (
                <NoticeCard key={notice.notice_id} notice={notice} onClick={setSelectedNotice} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* All notices */}
        <div>
          {pinned.length > 0 && others.length > 0 && (
            <h2 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">Recent</h2>
          )}
          <div className="space-y-4">
            {others.map((notice, i) => (
              <NoticeCard key={notice.notice_id} notice={notice} onClick={setSelectedNotice} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 font-medium text-lg">No notices found</p>
              <p className="text-sm text-gray-300 mt-2">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>

      {selectedNotice && <NoticeDetail notice={selectedNotice} onClose={() => setSelectedNotice(null)} />}
    </div>
  );
}
