import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, Save, X, Edit2, Phone, Calendar, Droplet, Shield } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../Auth/AuthContext.jsx";
import Nav from "../Home/Nav.jsx";
import studentService from "../Server/studentService";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const student = user?.student || null;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [form, setForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [photoError, setPhotoError] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await studentService.me();
      setProfile(res.data);
      setForm({
        phone_number: res.data.phone_number || "",
        guardian_number: res.data.guardian_number || "",
        guardian_email: res.data.guardian_email || "",
        present_address: res.data.present_address || "",
        permanent_address: res.data.permanent_address || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleLogout = async () => { await logout(); navigate("/login"); };

  const handleSaveProfile = async () => {
    try {
      const res = await studentService.updateMe(form);
      setProfile(res.data);
      setEditing(false);
      Swal.fire("Updated", "Profile updated successfully", "success");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to update profile", "error");
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword) {
      Swal.fire("Error", "Current password is required", "error");
      return;
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      Swal.fire("Error", "New password must be at least 6 characters", "error");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Swal.fire("Error", "New passwords do not match", "error");
      return;
    }
    try {
      await studentService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setChangingPassword(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      Swal.fire("Updated", "Password changed successfully", "success");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to change password", "error");
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-[#FAF9F6] border border-gray-200 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F2440]/15 focus:border-[#1F2440] transition-all";

  const showPhoto = profile?.photo_url && !photoError;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6]">
        <Nav student={student} onLogout={handleLogout} />
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#1F2440] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav student={student} onLogout={handleLogout} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif-display text-2xl font-semibold text-[#1F2440]">My Profile</h1>
          <p className="text-gray-400 text-sm mt-1">View and manage your information</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#E7E4DB] overflow-hidden"
        >
          {/* Banner with gradient animation */}
          <motion.div
            className="h-28 bg-gradient-to-r from-[#1F2440] via-[#2C3359] to-[#1F2440] bg-[length:200%_100%]"
            animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* Avatar overlapping banner */}
          <div className="px-6 -mt-10">
            <motion.div
              className="w-[80px] h-[80px] rounded-xl bg-[#1F2440] flex items-center justify-center border-4 border-white shrink-0 overflow-hidden"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {showPhoto ? (
                <img
                  src={`http://localhost:5000${profile.photo_url}`}
                  alt={profile?.name}
                  className="w-full h-full object-cover"
                  onError={() => setPhotoError(true)}
                />
              ) : (
                <User className="w-8 h-8 text-white" strokeWidth={1.75} />
              )}
            </motion.div>
          </div>

          {/* Name and info below banner */}
          <div className="px-6 pb-6 pt-3">
            <motion.h2
              className="font-serif-display text-xl font-semibold text-[#1F2440]"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {profile?.name}
            </motion.h2>
            <p className="text-sm text-gray-400">{profile?.student_id} &middot; Class {profile?.class} &middot; Roll {profile?.roll_number}</p>

            {/* Quick Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {[
                { icon: Calendar, label: "DOB", value: profile?.date_of_birth },
                { icon: Droplet, label: "Blood", value: profile?.blood_group },
                { icon: Phone, label: "Phone", value: profile?.phone_number },
                { icon: Shield, label: "Status", value: profile?.status },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.08 }}
                  whileHover={{ y: -3, scale: 1.03 }}
                  className="bg-[#FAF9F6] rounded-xl p-3 text-center border border-[#E7E4DB]/50"
                >
                  <item.icon className="w-4 h-4 text-[#9C8054] mx-auto mb-1.5" strokeWidth={1.75} />
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-semibold text-[#1F2440] mt-0.5 truncate">{item.value || "—"}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Edit Profile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-[#E7E4DB] p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif-display text-sm font-semibold text-[#1F2440]">Personal Information</h3>
            {!editing ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#1F2440] hover:bg-[#1F2440]/5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </motion.button>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldRow label="Name" value={profile?.name} />
              <FieldRow label="Student ID" value={profile?.student_id} />
              <FieldRow label="Class" value={`Class ${profile?.class}`} />
              <FieldRow label="Roll Number" value={profile?.roll_number} />
              <FieldRow label="Father" value={profile?.father_name} />
              <FieldRow label="Mother" value={profile?.mother_name} />
              <FieldRow label="Guardian" value={profile?.relationship_with_guardian} />
              <FieldRow label="Guardian Number" value={profile?.guardian_number} />
            </div>

            {editing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-4 border-t border-gray-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Phone Number</label>
                    <input value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} className={inputClass} placeholder="Phone number" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Guardian Number</label>
                    <input value={form.guardian_number} onChange={(e) => setForm({ ...form, guardian_number: e.target.value })} className={inputClass} placeholder="Guardian number" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">Guardian Email</label>
                    <input value={form.guardian_email} onChange={(e) => setForm({ ...form, guardian_email: e.target.value })} className={inputClass} placeholder="Guardian email" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Present Address</label>
                    <input value={form.present_address} onChange={(e) => setForm({ ...form, present_address: e.target.value })} className={inputClass} placeholder="Present address" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Permanent Address</label>
                    <input value={form.permanent_address} onChange={(e) => setForm({ ...form, permanent_address: e.target.value })} className={inputClass} placeholder="Permanent address" />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1F2440] text-white text-sm font-semibold hover:bg-[#2C3359] transition-colors"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-[#E7E4DB] p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif-display text-sm font-semibold text-[#1F2440]">Change Password</h3>
            {!changingPassword ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setChangingPassword(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#1F2440] hover:bg-[#1F2440]/5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" /> Change
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setChangingPassword(false); setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </motion.button>
            )}
          </div>

          {changingPassword ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs text-gray-400 mb-1">Current Password *</label>
                <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className={inputClass} placeholder="Enter current password" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">New Password *</label>
                <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className={inputClass} placeholder="Min 6 characters" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Confirm New Password *</label>
                <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className={inputClass} placeholder="Re-enter new password" />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleChangePassword}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1F2440] text-white text-sm font-semibold hover:bg-[#2C3359] transition-colors"
              >
                <Lock className="w-4 h-4" /> Update Password
              </motion.button>
            </motion.div>
          ) : (
            <p className="text-sm text-gray-400">Click "Change" to update your password.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function InfoBadge({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FAF9F6]">
      <Icon className="w-4 h-4 text-[#9C8054] shrink-0" strokeWidth={1.75} />
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-xs font-semibold text-gray-700 truncate">{value || "-"}</p>
      </div>
    </div>
  );
}

function FieldRow({ label, value }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-gray-700">{value || "-"}</p>
    </div>
  );
}
