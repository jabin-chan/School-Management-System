import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Send, Upload, User, Users, MapPin, Phone, BookOpen } from "lucide-react";
import Swal from "sweetalert2";
import admissionService from "../Server/admissionService";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const initialForm = {
  applicant_name: "",
  father_name: "",
  mother_name: "",
  date_of_birth: "",
  blood_group: "",
  class: "",
  present_address: "",
  permanent_address: "",
  guardian_number: "",
  guardian_email: "",
  relationship_with_guardian: "",
};

export default function AdmissionPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [tc, setTc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = [
      "applicant_name", "father_name", "mother_name", "date_of_birth",
      "blood_group", "class", "present_address", "permanent_address",
      "guardian_number", "guardian_email", "relationship_with_guardian",
    ];
    const missing = required.filter((f) => !form[f].trim());
    if (missing.length) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (photo) formData.append("photo", photo);
      if (tc) formData.append("previousSchoolTc", tc);

      await admissionService.apply(formData);

      Swal.fire({
        icon: "success",
        title: "Application Submitted!",
        text: "Your application is under review. You will receive your student ID once approved by the admin.",
        confirmButtonColor: "#1F2440",
      }).then(() => navigate("/login"));
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit application";
      Swal.fire("Error", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const sectionClass =
    "bg-white rounded-2xl p-6 border border-[#E7E4DB] shadow-[0_2px_16px_rgba(31,36,64,0.04)]";
  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-[#FAF9F6] text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F2440]/15 focus:border-[#1F2440] transition-all";
  const labelClass = "block text-xs font-semibold text-[#1F2440] uppercase tracking-wide mb-1.5";

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      <div className="h-[3px] w-full bg-[#1F2440]" />

      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-8"
        >
          <Link to="/" className="mb-5">
            <div className="w-14 h-14 rounded-xl bg-[#1F2440] flex items-center justify-center shadow-lg shadow-[#1F2440]/20">
              <GraduationCap className="w-7 h-7 text-white" strokeWidth={1.75} />
            </div>
          </Link>
          <h1 className="font-serif-display text-2xl font-semibold text-[#1F2440]">
            Admission Application
          </h1>
          <p className="text-gray-400 text-sm mt-1.5 text-center max-w-sm">
            Fill out the form below. After submission, the admin will review your application.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Info */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={sectionClass}>
            <div className="flex items-center gap-2.5 mb-5">
              <User className="w-4 h-4 text-[#9C8054]" strokeWidth={1.75} />
              <h2 className="font-serif-display text-base font-semibold text-[#1F2440]">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input name="applicant_name" value={form.applicant_name} onChange={handleChange} placeholder="Applicant's full name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Date of Birth *</label>
                <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Blood Group *</label>
                <select name="blood_group" value={form.blood_group} onChange={handleChange} className={inputClass}>
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map((bg) => (<option key={bg} value={bg}>{bg}</option>))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Class Applying For *</label>
                <select name="class" value={form.class} onChange={handleChange} className={inputClass}>
                  <option value="">Select class</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => (<option key={c} value={c}>Class {c}</option>))}
                </select>
              </div>
            </div>

            {/* Photo */}
            <div className="mt-4">
              <label className={labelClass}>Photo</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-gray-300 bg-[#FAF9F6] text-sm text-gray-500 cursor-pointer hover:border-[#1F2440] hover:text-[#1F2440] transition-colors">
                  <Upload className="w-4 h-4" />
                  {photo ? photo.name : "Choose photo"}
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
                {photoPreview && (
                  <img src={photoPreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                )}
              </div>
            </div>
          </motion.div>

          {/* Family Info */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={sectionClass}>
            <div className="flex items-center gap-2.5 mb-5">
              <Users className="w-4 h-4 text-[#9C8054]" strokeWidth={1.75} />
              <h2 className="font-serif-display text-base font-semibold text-[#1F2440]">
                Family Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Father&apos;s Name *</label>
                <input name="father_name" value={form.father_name} onChange={handleChange} placeholder="Father's full name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Mother&apos;s Name *</label>
                <input name="mother_name" value={form.mother_name} onChange={handleChange} placeholder="Mother's full name" className={inputClass} />
              </div>
            </div>
          </motion.div>

          {/* Guardian & Contact */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={sectionClass}>
            <div className="flex items-center gap-2.5 mb-5">
              <Phone className="w-4 h-4 text-[#9C8054]" strokeWidth={1.75} />
              <h2 className="font-serif-display text-base font-semibold text-[#1F2440]">
                Guardian &amp; Contact
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Guardian Phone *</label>
                <input name="guardian_number" value={form.guardian_number} onChange={handleChange} placeholder="Guardian phone number" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Guardian Email *</label>
                <input type="email" name="guardian_email" value={form.guardian_email} onChange={handleChange} placeholder="Guardian email" className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Relationship with Guardian *</label>
                <input name="relationship_with_guardian" value={form.relationship_with_guardian} onChange={handleChange} placeholder="e.g. Father, Mother, Uncle" className={inputClass} />
              </div>
            </div>
          </motion.div>

          {/* Address */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={sectionClass}>
            <div className="flex items-center gap-2.5 mb-5">
              <MapPin className="w-4 h-4 text-[#9C8054]" strokeWidth={1.75} />
              <h2 className="font-serif-display text-base font-semibold text-[#1F2440]">
                Address
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Present Address *</label>
                <input name="present_address" value={form.present_address} onChange={handleChange} placeholder="Present address" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Permanent Address *</label>
                <input name="permanent_address" value={form.permanent_address} onChange={handleChange} placeholder="Permanent address" className={inputClass} />
              </div>
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={sectionClass}>
            <div className="flex items-center gap-2.5 mb-5">
              <BookOpen className="w-4 h-4 text-[#9C8054]" strokeWidth={1.75} />
              <h2 className="font-serif-display text-base font-semibold text-[#1F2440]">
                Documents
              </h2>
            </div>

            <div>
              <label className={labelClass}>Previous School Transfer Certificate</label>
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-gray-300 bg-[#FAF9F6] text-sm text-gray-500 cursor-pointer hover:border-[#1F2440] hover:text-[#1F2440] transition-colors">
                <Upload className="w-4 h-4" />
                {tc ? tc.name : "Upload TC (optional)"}
                <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={(e) => setTc(e.target.files[0])} className="hidden" />
              </label>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-col sm:flex-row items-center gap-4 pt-1">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1F2440] hover:bg-[#2C3359] text-white px-8 py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Application
                </>
              )}
            </motion.button>
            <Link to="/login" className="text-sm text-gray-500 hover:text-[#1F2440] transition-colors">
              Already have an account? Log in
            </Link>
          </motion.div>
        </form>
      </div>

      <p className="text-center text-xs text-gray-400 py-6 tracking-wide">
        &copy; {new Date().getFullYear()} StudyBuddy
      </p>
    </div>
  );
}
