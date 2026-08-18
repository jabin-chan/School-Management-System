import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign, Search, CheckCircle, Clock, AlertCircle, ChevronDown,
  ChevronRight, UserCheck, Calendar, Filter
} from "lucide-react";
import Swal from "sweetalert2";
import adminService from "../Server/adminService";

const formatBDT = (amount) => "BDT " + amount.toLocaleString("en-IN");

export default function AdminFees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeeId, setSelectedFeeId] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPaid, setFilterPaid] = useState("all");

  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await adminService.getFees();
      setFees(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFees(); }, []);

  const fetchStudents = async (feeId) => {
    setStudentsLoading(true);
    try {
      const res = await adminService.getFeeStudents(feeId);
      setStudents(res.data.data || []);
    } catch (err) {
      console.error(err);
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleSelectFee = (feeId) => {
    if (selectedFeeId === feeId) {
      setSelectedFeeId(null);
      setStudents([]);
    } else {
      setSelectedFeeId(feeId);
      fetchStudents(feeId);
    }
  };

  const handleMarkPaid = async (feeId, studentId, studentName) => {
    const result = await Swal.fire({
      title: `Mark as paid?`,
      text: `Mark ${studentName}'s fee as paid`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4B7A5A",
      confirmButtonText: "Mark Paid",
    });
    if (!result.isConfirmed) return;
    try {
      await adminService.markStudentPaid(feeId, studentId);
      Swal.fire("Updated", "Fee marked as paid", "success");
      fetchStudents(feeId);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  const getFeeStats = (fee) => {
    const paid = fee.paid_count ?? 0;
    const total = fee.total_count ?? 0;
    const unpaid = total - paid;
    const status = unpaid === 0 ? "paid" : new Date(fee.due_date) < new Date() ? "overdue" : "pending";
    return { paid, unpaid, total, status };
  };

  const filteredStudents = students.filter((s) => {
    const matchSearch = !searchTerm ||
      s.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPaid = filterPaid === "all" ||
      (filterPaid === "paid" && s.is_paid) ||
      (filterPaid === "unpaid" && !s.is_paid);
    return matchSearch && matchPaid;
  });

  const selectedFee = fees.find((f) => f.fee_id === selectedFeeId);
  const selectedStats = selectedFee ? getFeeStats(selectedFee) : null;

  const totalFees = fees.length;
  const totalStudents = fees.reduce((sum, f) => sum + (f.total_count ?? 0), 0);
  const totalPaid = fees.reduce((sum, f) => sum + (f.paid_count ?? 0), 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-[#818CF8]" />
          Fees Management
        </h1>
        <p className="text-sm text-gray-400 mt-1">Manage all fees and student payments</p>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Fees", value: totalFees, color: "bg-[#6366F1]" },
          { label: "Total Students", value: totalStudents, color: "bg-[#38BDF8]" },
          { label: "Paid", value: totalPaid, color: "bg-emerald-500" },
          { label: "Unpaid", value: totalStudents - totalPaid, color: "bg-rose-500" },
        ].map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-[#1E293B] rounded-xl p-4 border border-gray-700/50"
          >
            <p className="text-xs text-gray-400">{c.label}</p>
            <p className="text-xl font-bold text-white mt-1">{c.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Fees list */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="bg-[#1E293B] rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-700/50">
            <h2 className="text-sm font-semibold text-white">All Fees</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 mx-auto border-4 border-[#818CF8]/20 border-t-[#818CF8] rounded-full animate-spin" />
            </div>
          ) : fees.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No fees found</div>
          ) : (
            <div className="divide-y divide-gray-700/50">
              {fees.map((fee) => {
                const stats = getFeeStats(fee);
                const isSelected = selectedFeeId === fee.fee_id;
                const percentage = stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0;

                return (
                  <div key={fee.fee_id}>
                    <button
                      onClick={() => handleSelectFee(fee.fee_id)}
                      className={`w-full text-left px-5 py-4 flex items-center gap-4 transition-colors ${
                        isSelected ? "bg-[#6366F1]/10" : "hover:bg-white/5"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        stats.status === "paid" ? "bg-emerald-500/20" :
                        stats.status === "overdue" ? "bg-rose-500/20" : "bg-amber-500/20"
                      }`}>
                        {isSelected ?
                          <ChevronDown className="w-4 h-4 text-[#818CF8]" /> :
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        }
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white truncate">{fee.fee_title}</span>
                          <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full uppercase">{fee.fee_name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due {new Date(fee.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          {fee.class && <span>{fee.class}</span>}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-white">{formatBDT(fee.amount)}</p>
                        <p className="text-[10px] text-gray-500">per student</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className={`w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden`}>
                          <div
                            className={`h-full rounded-full ${
                              stats.status === "paid" ? "bg-emerald-500" :
                              stats.status === "overdue" ? "bg-rose-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-400 w-8 text-right">{percentage}%</span>
                      </div>
                    </button>

                    {/* Expanded student list */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-4 space-y-3">
                            {/* Stats row */}
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-gray-400">Total: <span className="text-white font-semibold">{stats.total}</span></span>
                              <span className="text-emerald-400">Paid: <span className="font-semibold">{stats.paid}</span></span>
                              <span className="text-rose-400">Unpaid: <span className="font-semibold">{stats.unpaid}</span></span>
                            </div>

                            {/* Filters */}
                            <div className="flex items-center gap-3">
                              <div className="relative flex-1 max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                                <input
                                  type="text"
                                  placeholder="Search students..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  className="w-full pl-9 pr-3 py-2 bg-[#0F172A] rounded-lg border border-gray-700 text-sm text-white focus:outline-none focus:border-[#818CF8]"
                                />
                              </div>
                              <div className="flex gap-1">
                                {["all", "paid", "unpaid"].map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() => setFilterPaid(opt)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                                      filterPaid === opt
                                        ? "bg-[#6366F1] text-white"
                                        : "bg-gray-800 text-gray-400 hover:text-white"
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Students list */}
                            <div className="bg-[#0F172A] rounded-lg border border-gray-700/50 max-h-72 overflow-y-auto">
                              {studentsLoading ? (
                                <div className="p-6 text-center">
                                  <div className="w-6 h-6 mx-auto border-2 border-[#818CF8]/20 border-t-[#818CF8] rounded-full animate-spin" />
                                </div>
                              ) : filteredStudents.length === 0 ? (
                                <div className="p-6 text-center text-gray-500 text-sm">No students found</div>
                              ) : (
                                <div className="divide-y divide-gray-700/30">
                                  {filteredStudents.map((s) => (
                                    <div key={s.student_fee_id} className="flex items-center justify-between px-4 py-3">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                                          s.is_paid ? "bg-emerald-500" : "bg-gray-600"
                                        }`}>
                                          {s.student_name?.charAt(0) || "?"}
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-white">{s.student_name}</p>
                                          <p className="text-[10px] text-gray-500">{s.student_number} &middot; {s.class}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        {s.is_paid ? (
                                          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            Paid
                                          </span>
                                        ) : (
                                          <button
                                            onClick={() => handleMarkPaid(selectedFeeId, s.student_id, s.student_name)}
                                            className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-amber-500/10 transition-all"
                                          >
                                            <UserCheck className="w-3.5 h-3.5" />
                                            Mark Paid
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
