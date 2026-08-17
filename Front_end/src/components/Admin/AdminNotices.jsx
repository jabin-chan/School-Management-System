import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Plus, Trash2, X, Pin, Search } from "lucide-react";
import Swal from "sweetalert2";
import adminService from "../Server/adminService";

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "general", is_pinned: false, expires_at: "" });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await adminService.getNotices();
      setNotices(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      await adminService.createNotice(formData);
      Swal.fire("Created", "Notice published", "success");
      setShowForm(false);
      setForm({ title: "", content: "", category: "general", is_pinned: false, expires_at: "" });
      fetchNotices();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: "Delete notice?", icon: "warning", showCancelButton: true, confirmButtonColor: "#EF4444", confirmButtonText: "Delete" });
    if (!result.isConfirmed) return;
    try {
      await adminService.deleteNotice(id);
      Swal.fire("Deleted", "Notice removed", "success");
      fetchNotices();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-[#0F172A] border border-gray-600 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 transition-all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Notices</h1>
          <p className="text-gray-400 text-sm mt-1">Create and manage school notices</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] text-white text-sm font-medium hover:bg-[#5558E6] transition-colors">
          {showForm ? <X className="w-4 h-4" /> : <><Plus className="w-4 h-4" /> New Notice</>}
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
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="Notice title" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Content *</label>
              <textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={inputClass} rows={3} placeholder="Notice content" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {["general", "exam", "admission", "holiday", "event", "urgent"].map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Expires At</label>
              <input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} className={inputClass} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="pinned" checked={form.is_pinned} onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })} className="w-4 h-4 rounded" />
              <label htmlFor="pinned" className="text-sm text-gray-300">Pin this notice</label>
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#10B981] text-white text-sm font-semibold hover:bg-[#059669] transition-colors">
            Publish Notice
          </button>
        </motion.form>
      )}

      <div className="bg-[#1E293B] rounded-2xl border border-gray-700/50 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notices yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/30">
            {notices.map((n) => (
              <div key={n.notice_id} className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {n.is_pinned === 1 && <Pin className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />}
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#6366F1]/15 text-[#818CF8]">
                        {n.category}
                      </span>
                      {n.expires_at && (
                        <span className="text-xs text-gray-500">Expires {new Date(n.expires_at).toLocaleDateString()}</span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-white">{n.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.content}</p>
                  </div>
                  <button onClick={() => handleDelete(n.notice_id)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
