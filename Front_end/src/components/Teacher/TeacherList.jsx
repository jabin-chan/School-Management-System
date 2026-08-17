import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Loader2, Users } from "lucide-react";
import TeacherCard from "./TeacherCard";
import teacherService from "../Server/teacherService";

export default function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const { data } = await teacherService.listPublic({ limit: 50 });
      setTeachers(data.data || []);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  // Use mock data when API returns empty (for development/demo)
  const displayTeachers = teachers.length > 0 ? teachers : [
    {
      teacher_id: "TCH00001",
      name: "Dr. Sarah Johnson",
      designation: "Head of Mathematics",
      subject: "Mathematics",
      qualification: "Ph.D. Mathematics",
      email: "sarah.j@school.com",
      phone_number: "+8801712345678",
      joining_date: "2020-01-15",
      bio: "Passionate about making math accessible and fun for every student.",
      is_active: 1,
    },
    {
      teacher_id: "TCH00002",
      name: "Mr. Rahman Ahmed",
      designation: "Senior Physics Teacher",
      subject: "Physics",
      qualification: "M.Sc. Physics",
      email: "rahman.a@school.com",
      phone_number: "+8801812345678",
      joining_date: "2019-06-20",
      bio: "Bringing the wonders of physics to life through experiments and real-world examples.",
      is_active: 1,
    },
    {
      teacher_id: "TCH00003",
      name: "Ms. Priya Sharma",
      designation: "English Language Teacher",
      subject: "English",
      qualification: "M.A. English Literature",
      email: "priya.s@school.com",
      phone_number: "+8801912345678",
      joining_date: "2021-03-10",
      bio: "Helping students discover the beauty of language and effective communication.",
      is_active: 1,
    },
    {
      teacher_id: "TCH00004",
      name: "Dr. Kamal Hossain",
      designation: "Chemistry Teacher",
      subject: "Chemistry",
      qualification: "Ph.D. Chemistry",
      email: "kamal.h@school.com",
      phone_number: "+8801612345678",
      joining_date: "2018-09-01",
      bio: "Turning complex chemistry concepts into exciting discoveries.",
      is_active: 1,
    },
    {
      teacher_id: "TCH00005",
      name: "Ms. Fatima Begum",
      designation: "Biology Teacher",
      subject: "Biology",
      qualification: "M.Sc. Biology",
      email: "fatima.b@school.com",
      phone_number: "+8801512345678",
      joining_date: "2022-02-14",
      bio: "Inspiring curiosity about the living world through hands-on learning.",
      is_active: 1,
    },
    {
      teacher_id: "TCH00006",
      name: "Mr. David Chen",
      designation: "Computer Science Teacher",
      subject: "Computer Science",
      qualification: "B.Sc. Computer Science",
      email: "david.c@school.com",
      phone_number: "+8801312345678",
      joining_date: "2023-01-10",
      bio: "Teaching the next generation of coders and problem solvers.",
      is_active: 1,
    },
  ];

  // Get unique subjects for filter
  const subjects = [...new Set(displayTeachers.map((t) => t.subject).filter(Boolean))];

  // Filter teachers
  const filtered = displayTeachers.filter((t) => {
    const matchesSearch =
      !search ||
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.subject?.toLowerCase().includes(search.toLowerCase()) ||
      t.designation?.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = !selectedSubject || t.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-[#1F2440] p-7 md:p-9 border-b-[3px] border-b-[#9C8054]"
      >
        <div className="absolute -right-4 -top-6 w-44 h-44 text-white/[0.05]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path d="M12 14l9-5-9-5-9 5 9 5zM12 14v7m0 0l-3-3m3 3l3-3" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl">
          <p className="text-[#B79B6B] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Our Faculty
          </p>
          <h1 className="font-serif-display text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-4">
            Dedicated Teachers, <span className="italic text-[#B79B6B]">Inspiring Minds</span>
          </h1>
          <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl">
            Meet the passionate educators committed to nurturing every student&apos;s growth and success.
          </p>
        </div>
      </motion.div>

      {/* Search + Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, subject, or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-[#1F2440] focus:ring-2 focus:ring-[#1F2440]/10 transition-all"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:border-[#1F2440] focus:ring-2 focus:ring-[#1F2440]/10 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Results count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 text-sm text-gray-500"
      >
        <Users className="w-4 h-4" />
        <span>{filtered.length} teacher{filtered.length !== 1 ? "s" : ""} found</span>
      </motion.div>

      {/* Loading state */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-20"
          >
            <Loader2 className="w-8 h-8 text-[#1F2440] animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teacher grid */}
      {!loading && filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {filtered.map((teacher, index) => (
            <TeacherCard
              key={teacher.teacher_id}
              teacher={teacher}
              onClick={setSelectedTeacher}
              index={index}
            />
          ))}
        </motion.div>
      )}

      {/* Empty state */}
      <AnimatePresence>
        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center"
            >
              <Users className="w-8 h-8 text-gray-300" />
            </motion.div>
            <p className="text-gray-500 font-medium">No teachers found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teacher detail modal */}
      {selectedTeacher && (
        <TeacherDetailModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
        />
      )}
    </div>
  );
}

function TeacherDetailModal({ teacher, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-[#E7E4DB]"
      >
        {/* Top accent */}
        <div className="h-[3px] bg-[#1F2440]" />

        <div className="p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            ✕
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-5">
            {teacher.photo_url ? (
              <img
                src={`http://localhost:5000${teacher.photo_url}`}
                alt={teacher.name}
                className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-[#1F2440] flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white font-serif-display">
                  {teacher.name?.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-[#1F2440] font-serif-display">
                {teacher.name}
              </h2>
              <p className="text-[#9C8054] font-medium">{teacher.designation}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className={`w-2 h-2 rounded-full ${teacher.is_active ? "bg-[#4B7A5A]" : "bg-gray-300"}`} />
                <span className="text-xs text-gray-500">{teacher.is_active ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </div>

          {/* Subject */}
          {teacher.subject && (
            <div className="mb-4 p-3 bg-[#1F2440]/5 rounded-xl border border-[#1F2440]/10">
              <p className="text-xs text-gray-400 mb-1">Subject</p>
              <p className="text-sm font-semibold text-[#1F2440]">{teacher.subject}</p>
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {teacher.qualification && (
              <div className="p-3 bg-[#9C8054]/5 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Qualification</p>
                <p className="text-sm font-medium text-gray-700">{teacher.qualification}</p>
              </div>
            )}
            {teacher.joining_date && (
              <div className="p-3 bg-[#1F2440]/5 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Joined</p>
                <p className="text-sm font-medium text-gray-700">{teacher.joining_date}</p>
              </div>
            )}
            {teacher.email && (
              <div className="p-3 bg-[#9C8054]/5 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <p className="text-sm font-medium text-gray-700 truncate">{teacher.email}</p>
              </div>
            )}
            {teacher.phone_number && (
              <div className="p-3 bg-[#1F2440]/5 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Phone</p>
                <p className="text-sm font-medium text-gray-700">{teacher.phone_number}</p>
              </div>
            )}
          </div>

          {/* Bio */}
          {teacher.bio && (
            <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#E7E4DB]">
              <p className="text-xs text-gray-400 mb-2">About</p>
              <p className="text-sm text-gray-600 leading-relaxed">{teacher.bio}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
