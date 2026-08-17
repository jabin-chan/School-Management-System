import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, CheckCircle, XCircle, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import adminService from "../Server/adminService";

export default function AdminAdmissions() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const [approveModal, setApproveModal] = useState(null);
  const [approveForm, setApproveForm] = useState({ student_id: "", password: "" });

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAdmissions({ status: filter, page, limit: 10 });
      setAdmissions(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchAdmissions();
  }, [filter]);

  useEffect(() => {
    fetchAdmissions();
  }, [page]);

  const handleStatus = async (id, status, credentials) => {
    if (status === "passed") {
      setApproveModal(id);
      setApproveForm({ student_id: "", password: "" });
      return;
    }

    const result = await Swal.fire({
      title: "Reject Application?",
      text: "This will mark the application as failed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Reject",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await adminService.updateAdmissionStatus(id, status);
      Swal.fire("Done", res.data.message, "success");
      fetchAdmissions();
      setSelectedApp(null);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to update status", "error");
    }
  };

  const handleApprove = async () => {
    if (!approveForm.student_id.trim()) {
      Swal.fire("Error", "Student ID is required", "error");
      return;
    }
    if (!approveForm.password || approveForm.password.length < 6) {
      Swal.fire("Error", "Password must be at least 6 characters", "error");
      return;
    }

    try {
      const res = await adminService.updateAdmissionStatus(approveModal, "passed", {
        student_id: approveForm.student_id.trim(),
        password: approveForm.password,
      });
      setApproveModal(null);
      await Swal.fire({
        icon: "success",
        title: "Student Created!",
        html: `
          <p>Student ID: <b>${res.data.student.student_id}</b></p>
          <p>Password: <b>${approveForm.password}</b></p>
          <p class="mt-2 text-sm text-gray-500">Share these credentials with the student.</p>
        `,
        confirmButtonColor: "#6366F1",
      });
      fetchAdmissions();
      setSelectedApp(null);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to create student", "error");
    }
  };

  const statusColor = (s) => {
    if (s === "pending") return "bg-[#F59E0B]/15 text-[#F59E0B]";
    if (s === "passed") return "bg-[#10B981]/15 text-[#10B981]";
    return "bg-[#EF4444]/15 text-[#EF4444]";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Admissions</h1>
        <p className="text-gray-400 text-sm mt-1">Review and manage admission applications</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["pending", "passed", "failed", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? "bg-[#6366F1] text-white"
                : "bg-[#1E293B] text-gray-400 hover:text-white border border-gray-700/50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#1E293B] rounded-2xl border border-gray-700/50 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : admissions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Class</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Guardian</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admissions.map((app) => (
                  <tr key={app.application_id} className="border-b border-gray-700/30 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{app.applicant_name}</td>
                    <td className="px-4 py-3 text-gray-300">Class {app.class}</td>
                    <td className="px-4 py-3 text-gray-300">{app.guardian_number}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(app.applied_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {app.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatus(app.application_id, "passed")}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-[#10B981] hover:bg-[#10B981]/10 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatus(app.application_id, "failed")}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700/50">
            <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1E293B] rounded-2xl border border-gray-700/50 w-full max-w-lg max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700/50">
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  Application Details
                </h3>
                <button onClick={() => setSelectedApp(null)} className="p-1 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                {selectedApp.photo_url && (
                  <img src={`http://localhost:5000${selectedApp.photo_url}`} alt="" className="w-20 h-20 rounded-xl object-cover" />
                )}
                <DetailRow label="Name" value={selectedApp.applicant_name} />
                <DetailRow label="Class" value={`Class ${selectedApp.class}`} />
                <DetailRow label="Date of Birth" value={selectedApp.date_of_birth} />
                <DetailRow label="Blood Group" value={selectedApp.blood_group} />
                <DetailRow label="Father" value={selectedApp.father_name} />
                <DetailRow label="Mother" value={selectedApp.mother_name} />
                <DetailRow label="Guardian" value={`${selectedApp.relationship_with_guardian} - ${selectedApp.guardian_number}`} />
                <DetailRow label="Email" value={selectedApp.guardian_email} />
                <DetailRow label="Present Address" value={selectedApp.present_address} />
                <DetailRow label="Permanent Address" value={selectedApp.permanent_address} />
                {selectedApp.previous_school_tc_url && (
                  <a
                    href={`http://localhost:5000${selectedApp.previous_school_tc_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#818CF8] text-sm hover:underline"
                  >
                    View Transfer Certificate
                  </a>
                )}

                {selectedApp.status === "pending" && (
                  <div className="flex gap-3 pt-3 border-t border-gray-700/50">
                    <button
                      onClick={() => handleStatus(selectedApp.application_id, "passed")}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleStatus(selectedApp.application_id, "failed")}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#EF4444] hover:bg-[#DC2626] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approve Modal - Enter Student ID & Password */}
      <AnimatePresence>
        {approveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setApproveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1E293B] rounded-2xl border border-gray-700/50 w-full max-w-md"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700/50">
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  Create Student Account
                </h3>
                <button onClick={() => setApproveModal(null)} className="p-1 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-sm text-gray-400">Provide a Student ID and password for this student.</p>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Student ID *</label>
                  <input
                    value={approveForm.student_id}
                    onChange={(e) => setApproveForm({ ...approveForm, student_id: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F172A] border border-gray-600 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 transition-all"
                    placeholder="e.g. STU00123456"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Password *</label>
                  <input
                    type="text"
                    value={approveForm.password}
                    onChange={(e) => setApproveForm({ ...approveForm, password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F172A] border border-gray-600 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 transition-all"
                    placeholder="Min 6 characters"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setApproveModal(null)}
                    className="flex-1 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApprove}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-white">{value || "-"}</p>
    </div>
  );
}
