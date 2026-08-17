import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Plus, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import adminService from "../Server/adminService";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await adminService.getStudents({ page, limit: 10, q: search || undefined });
      setStudents(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: `Delete ${name}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;
    try {
      await adminService.deleteStudent(id);
      Swal.fire("Deleted", "Student removed", "success");
      fetchStudents();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await adminService.setStudentStatus(id, status);
      Swal.fire("Updated", `Student marked as ${status}`, "success");
      fetchStudents();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Students</h1>
        <p className="text-gray-400 text-sm mt-1">Manage all enrolled students</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1E293B] border border-gray-700/50 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 transition-all"
          />
        </div>
        <button type="submit" className="px-4 py-2.5 rounded-xl bg-[#6366F1] text-white text-sm font-medium hover:bg-[#5558E6] transition-colors">
          Search
        </button>
      </form>

      <div className="bg-[#1E293B] rounded-2xl border border-gray-700/50 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No students found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Student ID</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Class</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Roll</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-gray-700/30 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-[#818CF8] font-mono text-xs">{s.student_id}</td>
                    <td className="px-4 py-3 text-white font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-gray-300">Class {s.class}</td>
                    <td className="px-4 py-3 text-gray-300">{s.roll_number}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        s.status === "active" ? "bg-[#10B981]/15 text-[#10B981]" :
                        s.status === "inactive" ? "bg-[#F59E0B]/15 text-[#F59E0B]" :
                        "bg-[#6366F1]/15 text-[#818CF8]"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {s.status === "active" ? (
                          <button onClick={() => handleStatus(s.id, "inactive")} className="text-xs text-[#F59E0B] hover:underline">Deactivate</button>
                        ) : (
                          <button onClick={() => handleStatus(s.id, "active")} className="text-xs text-[#10B981] hover:underline">Activate</button>
                        )}
                        <button onClick={() => handleDelete(s.id, s.name)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700/50">
            <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
