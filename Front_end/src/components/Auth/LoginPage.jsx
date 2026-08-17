import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Eye, EyeOff, LogIn } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
  const { studentLogin } = useAuth();
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId.trim() || !password.trim()) {
      Swal.fire("Error", "Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    try {
      await studentLogin(studentId.trim(), password);
      Swal.fire({
        icon: "success",
        title: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials";
      Swal.fire("Login Failed", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      <div className="h-[3px] w-full bg-[#1F2440]" />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
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
            Student Login
          </h1>
          <p className="text-gray-400 text-sm mt-1.5">Access your dashboard</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-2xl p-8 border border-[#E7E4DB] border-b-[3px] border-b-[#9C8054] shadow-[0_2px_16px_rgba(31,36,64,0.04)]"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Student ID */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2440] uppercase tracking-wide mb-2">
                Student ID
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. STU12345678"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-[#FAF9F6] text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F2440]/15 focus:border-[#1F2440] transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2440] uppercase tracking-wide mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 bg-[#FAF9F6] text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F2440]/15 focus:border-[#1F2440] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-[#1F2440] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-[#1F2440] hover:bg-[#2C3359] text-white py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Log In
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Admission link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-sm text-gray-500"
        >
          Don&apos;t have an account?{" "}
          <Link to="/admission" className="font-semibold text-[#9C8054] hover:underline">
            Apply for Admission
          </Link>
        </motion.p>
      </div>

      <p className="text-center text-xs text-gray-400 py-6 tracking-wide">
        &copy; {new Date().getFullYear()} StudyBuddy
      </p>
    </div>
  );
}
