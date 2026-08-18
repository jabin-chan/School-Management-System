import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Search, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";
import adminService from "../Server/adminService";

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", designation: "", subject: "", qualification: "", email: "", phone_number: "", bio: "" });

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getTeachers({ q: search || undefined });
      setTeachers(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeachers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      await adminService.createTeacher(formData);
      Swal.fire("Created", "Teacher added successfully", "success");
      setShowForm(false);
      setForm({ name: "", designation: "", subject: "", qualification: "", email: "", phone_number: "", bio: "" });
      fetchTeachers();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to create", "error");
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: `Delete ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;
    try {
      await adminService.deleteTeacher(id);
      Swal.fire("Deleted", "Teacher removed", "success");
      fetchTeachers();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-[#0F172A] border border-gray-600 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 transition-all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Teachers</h1>
          <p className="text-gray-400 text-sm mt-1">Manage school teachers</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] text-white text-sm font-medium hover:bg-[#5558E6] transition-colors">
          {showForm ? <X className="w-4 h-4" /> : <><GraduationCap className="w-4 h-4" /> Add Teacher</>}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreate}
          className="bg-[#1E293B] rounded-2xl p-5 border border-gray-700/50 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Full name" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Designation</label>
              <input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className={inputClass} placeholder="e.g. Senior Teacher" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Subject</label>
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputClass} placeholder="e.g. Mathematics" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Qualification</label>
              <input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} className={inputClass} placeholder="e.g. B.Sc, B.Ed" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="Email" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Phone</label>
              <input value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} className={inputClass} placeholder="Phone number" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={inputClass} rows={2} placeholder="Short bio" />
          </div>
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#10B981] text-white text-sm font-semibold hover:bg-[#059669] transition-colors">
            Create Teacher
          </button>
        </motion.form>
      )}

      <div className="bg-[#1E293B] rounded-2xl border border-gray-700/50 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <GraduationCap className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No teachers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">ID</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Subject</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Designation</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Email</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.teacher_id} className="border-b border-gray-700/30 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-[#818CF8] font-mono text-xs">{t.teacher_id}</td>
                    <td className="px-4 py-3 text-white font-medium">{t.name}</td>
                    <td className="px-4 py-3 text-gray-300">{t.subject || "-"}</td>
                    <td className="px-4 py-3 text-gray-300">{t.designation || "-"}</td>
                    <td className="px-4 py-3 text-gray-400">{t.email || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(t.teacher_id, t.name)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
