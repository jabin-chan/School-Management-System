import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, Search, ChevronDown, ChevronUp, Award, BookOpen, X, TrendingUp, Trophy, Medal,
} from "lucide-react";
import { useAuth } from "../Auth/AuthContext.jsx";
import Nav from "../Home/Nav.jsx";

const gradeColors = {
  "A+": "#1F2440",
  A: "#4B7A5A",
  "B+": "#9C8054",
  B: "#B79B6B",
  C: "#5B5A8C",
  D: "#C17A3D",
  F: "#A6402F",
};

const mockResults = [
  {
    result_id: 1, student_name: "Rahim Uddin", student_student_id: "STU2024001", student_class: "10",
    exam_name: "Mid-term Exam 2026", session_name: "2025-2026", total_marks: 1000, obtained_marks: 845, gpa: 4.8, grade: "A+",
    subjects: [
      { subject_name: "Mathematics", marks: 95, grade: "A+", grade_point: 5.0 },
      { subject_name: "Physics", marks: 92, grade: "A+", grade_point: 5.0 },
      { subject_name: "Chemistry", marks: 88, grade: "A", grade_point: 4.0 },
      { subject_name: "Biology", marks: 90, grade: "A+", grade_point: 5.0 },
      { subject_name: "English", marks: 85, grade: "A", grade_point: 4.0 },
      { subject_name: "Bangla", marks: 92, grade: "A+", grade_point: 5.0 },
      { subject_name: "ICT", marks: 93, grade: "A+", grade_point: 5.0 },
    ],
  },
  {
    result_id: 2, student_name: "Fatima Khatun", student_student_id: "STU2024002", student_class: "10",
    exam_name: "Mid-term Exam 2026", session_name: "2025-2026", total_marks: 1000, obtained_marks: 792, gpa: 4.5, grade: "A",
    subjects: [
      { subject_name: "Mathematics", marks: 85, grade: "A", grade_point: 4.0 },
      { subject_name: "Physics", marks: 82, grade: "A", grade_point: 4.0 },
      { subject_name: "Chemistry", marks: 78, grade: "B+", grade_point: 3.5 },
      { subject_name: "Biology", marks: 88, grade: "A", grade_point: 4.0 },
      { subject_name: "English", marks: 80, grade: "A", grade_point: 4.0 },
      { subject_name: "Bangla", marks: 90, grade: "A+", grade_point: 5.0 },
      { subject_name: "ICT", marks: 89, grade: "A", grade_point: 4.0 },
    ],
  },
  {
    result_id: 3, student_name: "Kamal Hossain", student_student_id: "STU2024003", student_class: "10",
    exam_name: "Mid-term Exam 2026", session_name: "2025-2026", total_marks: 1000, obtained_marks: 680, gpa: 3.8, grade: "B+",
    subjects: [
      { subject_name: "Mathematics", marks: 70, grade: "B", grade_point: 3.0 },
      { subject_name: "Physics", marks: 65, grade: "B", grade_point: 3.0 },
      { subject_name: "Chemistry", marks: 68, grade: "B", grade_point: 3.0 },
      { subject_name: "Biology", marks: 72, grade: "B+", grade_point: 3.5 },
      { subject_name: "English", marks: 62, grade: "B", grade_point: 3.0 },
      { subject_name: "Bangla", marks: 75, grade: "B+", grade_point: 3.5 },
      { subject_name: "ICT", marks: 78, grade: "B+", grade_point: 3.5 },
    ],
  },
  {
    result_id: 4, student_name: "Nusrat Jahan", student_student_id: "STU2024004", student_class: "9",
    exam_name: "Mid-term Exam 2026", session_name: "2025-2026", total_marks: 1000, obtained_marks: 910, gpa: 5.0, grade: "A+",
    subjects: [
      { subject_name: "Mathematics", marks: 98, grade: "A+", grade_point: 5.0 },
      { subject_name: "Physics", marks: 96, grade: "A+", grade_point: 5.0 },
      { subject_name: "Chemistry", marks: 94, grade: "A+", grade_point: 5.0 },
      { subject_name: "Biology", marks: 92, grade: "A+", grade_point: 5.0 },
      { subject_name: "English", marks: 88, grade: "A", grade_point: 4.0 },
      { subject_name: "Bangla", marks: 95, grade: "A+", grade_point: 5.0 },
      { subject_name: "ICT", marks: 97, grade: "A+", grade_point: 5.0 },
    ],
  },
  {
    result_id: 5, student_name: "Tanvir Ahmed", student_student_id: "STU2024005", student_class: "9",
    exam_name: "Mid-term Exam 2026", session_name: "2025-2026", total_marks: 1000, obtained_marks: 725, gpa: 4.1, grade: "A",
    subjects: [
      { subject_name: "Mathematics", marks: 78, grade: "B+", grade_point: 3.5 },
      { subject_name: "Physics", marks: 75, grade: "B+", grade_point: 3.5 },
      { subject_name: "Chemistry", marks: 72, grade: "B+", grade_point: 3.5 },
      { subject_name: "Biology", marks: 80, grade: "A", grade_point: 4.0 },
      { subject_name: "English", marks: 70, grade: "B", grade_point: 3.0 },
      { subject_name: "Bangla", marks: 85, grade: "A", grade_point: 4.0 },
      { subject_name: "ICT", marks: 82, grade: "A", grade_point: 4.0 },
    ],
  },
];

const positionConfig = [
  { pos: 1, label: "1st", icon: Trophy, color: "#9C8054", bg: "bg-[#9C8054]/10", ring: "ring-[#9C8054]/30" },
  { pos: 2, label: "2nd", icon: Medal, color: "#1F2440", bg: "bg-[#1F2440]/10", ring: "ring-[#1F2440]/30" },
  { pos: 3, label: "3rd", icon: Medal, color: "#5B5A8C", bg: "bg-[#5B5A8C]/10", ring: "ring-[#5B5A8C]/30" },
];

export default function Results() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const student = user?.student || null;
  const studentClass = student?.class ? String(student.class) : null;
  const handleLogout = async () => { await logout(); navigate("/login"); };

  // Filter results to only show the logged-in student's class
  const classResults = studentClass
    ? mockResults.filter((r) => r.student_class === studentClass)
    : [];

  // Sort by obtained_marks descending to determine positions
  const sortedResults = [...classResults].sort((a, b) => b.obtained_marks - a.obtained_marks);

  // Top 3 for podium
  const topThree = sortedResults.slice(0, 3);

  // Search filter
  const filtered = sortedResults.filter((r) => {
    return !search || r.student_name.toLowerCase().includes(search.toLowerCase()) || r.student_student_id.toLowerCase().includes(search.toLowerCase());
  });

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  // Find logged-in student's result
  const myResult = sortedResults.find((r) => r.student_student_id === student?.student_id);
  const myPosition = myResult ? sortedResults.indexOf(myResult) + 1 : null;

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav student={student} onLogout={handleLogout} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-[#1F2440]/[0.06]">
              <BarChart3 className="w-5 h-5 text-[#1F2440]" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="font-serif-display text-2xl font-semibold text-[#1F2440]">Exam Results</h1>
              <p className="text-sm text-gray-400">Class {studentClass || "—"} &middot; Mid-term Exam 2026</p>
            </div>
          </div>
        </motion.div>

        {/* My Result Highlight */}
        {myResult && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 bg-[#1F2440] rounded-2xl p-6 border-b-[3px] border-b-[#9C8054]"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#B79B6B] text-xs font-semibold tracking-[0.2em] uppercase">Your Result</span>
              {myPosition && (
                <span className="px-2 py-0.5 rounded-full bg-[#9C8054] text-white text-[10px] font-bold">
                  Rank #{myPosition}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif-display text-xl font-semibold text-white">{myResult.student_name}</h2>
                <p className="text-white/60 text-sm">{myResult.student_student_id} &middot; {myResult.exam_name}</p>
              </div>
              <div className="text-right">
                <p className="font-serif-display text-3xl font-bold text-white">{myResult.gpa.toFixed(1)}</p>
                <p className="text-[#B79B6B] text-sm font-semibold">{myResult.grade} &middot; {myResult.obtained_marks}/{myResult.total_marks}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top 3 Podium */}
        {topThree.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <h2 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Top Performers — Class {studentClass}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topThree.map((result, i) => {
                const config = positionConfig[i];
                const PosIcon = config.icon;
                return (
                  <motion.div
                    key={result.result_id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 400, damping: 15 } }}
                    className={`bg-white rounded-xl p-5 border border-[#E7E4DB] relative overflow-hidden`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: config.color }} />
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center ring-2 ${config.ring}`}
                        animate={i === 0 ? { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      >
                        <PosIcon className="w-5 h-5" style={{ color: config.color }} strokeWidth={1.75} />
                      </motion.div>
                      <div>
                        <motion.span
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: config.color }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                        >
                          {config.label} Position
                        </motion.span>
                      </div>
                    </div>
                    <h3 className="font-serif-display text-base font-semibold text-[#1F2440] mb-1">
                      {result.student_name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{result.student_student_id}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: config.color }}>{result.gpa.toFixed(1)} GPA</span>
                        <motion.span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: gradeColors[result.grade] || "#6B7280" }}
                          whileHover={{ scale: 1.15 }}
                        >
                          {result.grade}
                        </motion.span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{result.obtained_marks}/{result.total_marks} marks</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or student ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#1F2440] focus:ring-2 focus:ring-[#1F2440]/10 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100">
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Results list */}
        <div className="space-y-4">
          {filtered.map((result, i) => {
            const isExpanded = expandedId === result.result_id;
            const color = gradeColors[result.grade] || "#6B7280";
            const percentage = Math.round((result.obtained_marks / result.total_marks) * 100);
            const position = sortedResults.indexOf(result) + 1;
            const isTop3 = position <= 3;

            return (
              <motion.div
                key={result.result_id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
                className={`bg-white rounded-xl border overflow-hidden ${isTop3 ? "border-[#E7E4DB]" : "border-[#E7E4DB]"}`}
              >
                <button onClick={() => toggleExpand(result.result_id)} className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-gray-50/50 transition-colors">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 font-serif-display" style={{ backgroundColor: color }}>
                    {result.student_name.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-[#1F2440] truncate">{result.student_name}</h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: color }}>
                        <Award className="w-3 h-3" />
                        {result.grade}
                      </span>
                      {isTop3 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: positionConfig[position - 1].color + "15", color: positionConfig[position - 1].color }}>
                          #{position}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-400">{result.student_student_id}</span>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#1F2440]">
                        {result.obtained_marks}
                        <span className="text-xs font-normal text-gray-400">/{result.total_marks}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 -mt-0.5">{percentage}%</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: color + "14" }}>
                      <span className="text-sm font-extrabold leading-none" style={{ color }}>{result.gpa.toFixed(1)}</span>
                      <span className="text-[9px] font-medium text-gray-400 mt-0.5">GPA</span>
                    </div>
                  </div>

                  <div className="sm:hidden text-right shrink-0">
                    <p className="text-base font-bold text-[#1F2440]">{result.gpa.toFixed(1)}</p>
                    <p className="text-[10px] text-gray-400">{percentage}%</p>
                  </div>

                  <div className="shrink-0 ml-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 border-t border-gray-100">
                        <div className="flex items-center justify-between mt-4 mb-3">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject-wise Breakdown</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{result.exam_name}</span>
                            <span>&middot;</span>
                            <span>{result.session_name}</span>
                          </div>
                        </div>

                        <div className="bg-[#FAF9F6] rounded-lg overflow-hidden">
                          <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-gray-200/60">
                            <div className="col-span-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subject</div>
                            <div className="col-span-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Marks</div>
                            <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Grade</div>
                            <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">GP</div>
                          </div>

                          {result.subjects.map((subj, si) => {
                            const subjColor = gradeColors[subj.grade] || "#6B7280";
                            const subjPercent = Math.round((subj.marks / 100) * 100);
                            return (
                              <div key={si} className="grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-gray-200/30 last:border-b-0 hover:bg-white/60 transition-colors">
                                <div className="col-span-5">
                                  <span className="text-sm font-medium text-gray-700">{subj.subject_name}</span>
                                </div>
                                <div className="col-span-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-700 w-8 shrink-0">{subj.marks}</span>
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: subjPercent + "%" }}
                                        transition={{ duration: 0.6, delay: 0.05 * si }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: subjColor }}
                                      />
                                    </div>
                                    <span className="text-[10px] text-gray-400 w-8 text-right shrink-0">{subjPercent}%</span>
                                  </div>
                                </div>
                                <div className="col-span-1 flex justify-center">
                                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-md text-[10px] font-bold text-white" style={{ backgroundColor: subjColor }}>
                                    {subj.grade}
                                  </span>
                                </div>
                                <div className="col-span-2 text-right">
                                  <span className="text-sm font-bold" style={{ color: subjColor }}>{subj.grade_point.toFixed(1)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-4 p-4 bg-[#FAF9F6] rounded-lg border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" style={{ color }} />
                              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Overall Performance</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-gray-500">{result.obtained_marks}/{result.total_marks}</span>
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: color }}>
                                <Award className="w-3 h-3" />
                                GPA {result.gpa.toFixed(2)} - {result.grade}
                              </span>
                            </div>
                          </div>
                          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: percentage + "%" }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full rounded-full"
                              style={{ background: `linear-gradient(90deg, ${color}CC, ${color})` }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-[10px] text-gray-400">0%</span>
                            <span className="text-[10px] font-semibold" style={{ color }}>{percentage}% secured</span>
                            <span className="text-[10px] text-gray-400">100%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">No results found</p>
              <p className="text-sm text-gray-300 mt-1">Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
