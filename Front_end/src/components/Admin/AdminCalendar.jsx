import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Plus, Trash2, X, Edit2, Search } from "lucide-react";
import Swal from "sweetalert2";
import adminService from "../Server/adminService";

const EVENT_TYPES = [
  { value: "exam", label: "Exam", color: "#c0392b" },
  { value: "holiday", label: "Holiday", color: "#d4a017" },
  { value: "event", label: "Event", color: "#8e44ad" },
  { value: "admission", label: "Admission", color: "#27ae60" },
  { value: "meeting", label: "Meeting", color: "#1a2744" },
  { value: "sports", label: "Sports", color: "#d35400" },
];

export default function AdminCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", event_type: "event", start_date: "", end_date: "" });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCalendarEvents({ limit: 100 });
      setEvents(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", event_type: "event", start_date: "", end_date: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description || "",
      event_type: event.event_type,
      start_date: event.start_date?.split("T")[0] || "",
      end_date: event.end_date?.split("T")[0] || "",
    });
    setEditingId(event.event_id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.start_date) {
      Swal.fire("Error", "Title and start date are required", "error");
      return;
    }
    try {
      const payload = { ...form, end_date: form.end_date || null };
      if (editingId) {
        await adminService.updateCalendarEvent(editingId, payload);
        Swal.fire("Updated", "Event updated", "success");
      } else {
        await adminService.createCalendarEvent(payload);
        Swal.fire("Created", "Event created", "success");
      }
      resetForm();
      fetchEvents();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: "Delete event?", icon: "warning", showCancelButton: true, confirmButtonColor: "#EF4444", confirmButtonText: "Delete" });
    if (!result.isConfirmed) return;
    try {
      await adminService.deleteCalendarEvent(id);
      Swal.fire("Deleted", "Event removed", "success");
      fetchEvents();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  const getTypeConfig = (type) => EVENT_TYPES.find((t) => t.value === type) || EVENT_TYPES[2];

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-[#0F172A] border border-gray-600 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 transition-all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>Calendar</h1>
          <p className="text-gray-400 text-sm mt-1">Manage school events shown on the main calendar</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] text-white text-sm font-medium hover:bg-[#5558E6] transition-colors">
          {showForm ? <X className="w-4 h-4" /> : <><Plus className="w-4 h-4" /> New Event</>}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-[#1E293B] rounded-2xl p-5 border border-gray-700/50 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="Event title" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} rows={2} placeholder="Event description" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Event Type *</label>
              <select value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })} className={inputClass}>
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Start Date *</label>
              <input type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">End Date (optional)</label>
              <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#10B981] text-white text-sm font-semibold hover:bg-[#059669] transition-colors">
              {editingId ? "Update Event" : "Create Event"}
            </button>
          </div>
        </motion.form>
      )}

      <div className="bg-[#1E293B] rounded-2xl border border-gray-700/50 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No events yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/30">
            {events.map((event) => {
              const cfg = getTypeConfig(event.event_type);
              return (
                <div key={event.event_id} className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.color + "20", color: cfg.color }}>
                          {cfg.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(event.start_date).toLocaleDateString()}
                          {event.end_date && ` — ${new Date(event.end_date).toLocaleDateString()}`}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white">{event.title}</p>
                      {event.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{event.description}</p>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleEdit(event)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#818CF8] hover:bg-[#6366F1]/10 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(event.event_id)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
