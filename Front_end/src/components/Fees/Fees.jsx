import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle, Clock, AlertCircle, Calendar } from "lucide-react";
import { useAuth } from "../Auth/AuthContext.jsx";
import Nav from "../Home/Nav.jsx";
import studentService from "../Server/studentService.js";

const formatBDT = (amount) => "BDT " + amount.toLocaleString("en-IN");

export default function Fees() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const student = user?.student || null;
  const handleLogout = async () => { await logout(); navigate("/login"); };

  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.myFees()
      .then((res) => setFees(res.data.fees))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0);
  const paidFees = fees.filter((f) => f.is_paid);
  const unpaidFees = fees.filter((f) => !f.is_paid);

  const totalPaid = paidFees.reduce((sum, f) => sum + f.amount, 0);
  const totalUnpaid = unpaidFees.reduce((sum, f) => sum + f.amount, 0);

  const getFeeStatus = (fee) => {
    if (fee.is_paid) return "paid";
    if (new Date(fee.due_date) < new Date()) return "overdue";
    return "pending";
  };

  const getStatusStyles = (status) => {
    if (status === "paid") return { icon: CheckCircle, color: "bg-[#4B7A5A]", text: "text-[#4B7A5A]", bg: "bg-[#4B7A5A]/10" };
    if (status === "overdue") return { icon: AlertCircle, color: "bg-[#A6402F]", text: "text-[#A6402F]", bg: "bg-[#A6402F]/10" };
    return { icon: Clock, color: "bg-[#9C8054]", text: "text-[#9C8054]", bg: "bg-[#9C8054]/10" };
  };

  const summaryCards = [
    { icon: CreditCard, label: "Total Fees", value: fees.length, color: "bg-[#1F2440]" },
    { icon: CheckCircle, label: "Paid", value: paidFees.length, color: "bg-[#4B7A5A]" },
    { icon: Clock, label: "Pending", value: unpaidFees.length, color: "bg-[#9C8054]" },
    { icon: AlertCircle, label: "Amount Due", value: formatBDT(totalUnpaid), color: "bg-[#A6402F]" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav student={student} onLogout={handleLogout} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-[#1F2440]/[0.06]">
              <CreditCard className="w-5 h-5 text-[#1F2440]" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="font-serif-display text-2xl font-semibold text-[#1F2440]">My Fees</h1>
              <p className="text-sm text-gray-400">View your fee payments and due status</p>
            </div>
          </div>
        </motion.div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -3 }}
                className="bg-white rounded-xl p-4 md:p-5 border border-[#E7E4DB] transition-shadow hover:shadow-[0_4px_16px_rgba(31,36,64,0.06)]"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${card.color}`}>
                    <Icon className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-serif-display text-xl md:text-2xl font-semibold text-[#1F2440]">
                      {card.value}
                    </p>
                    <p className="text-xs text-gray-500">{card.label}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Fees list */}
        {loading ? (
          <div className="text-center py-16">
            <motion.div
              className="w-12 h-12 mx-auto border-4 border-[#1F2440]/20 border-t-[#1F2440] rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
              className="text-gray-400 mt-3 text-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading fees...
            </motion.p>
          </div>
        ) : fees.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center py-16"
          >
            <motion.div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CreditCard className="w-7 h-7 text-gray-300" />
            </motion.div>
            <p className="text-gray-400 font-medium">No fees assigned</p>
            <p className="text-sm text-gray-300 mt-1">You have no fees assigned yet</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {fees.map((fee, index) => {
              const status = getFeeStatus(fee);
              const style = getStatusStyles(status);
              const StatusIcon = style.icon;

              return (
                <motion.div
                  key={fee.id}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.04 * index, type: "spring", stiffness: 200 }}
                  whileHover={{ y: -4, scale: 1.01, transition: { type: "spring", stiffness: 400, damping: 15 } }}
                  className="bg-white rounded-xl border border-[#E7E4DB] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-[0_6px_20px_rgba(31,36,64,0.08)] transition-shadow"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <h3 className="font-serif-display text-base font-semibold text-[#1F2440] truncate">
                        {fee.fee_title}
                      </h3>
                      <span className="text-[10px] font-semibold text-[#1F2440] bg-[#1F2440]/[0.08] px-2 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
                        {fee.fee_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due {new Date(fee.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      {fee.fee_class && <span>{fee.fee_class}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-5">
                    <p className="font-serif-display text-lg font-bold text-[#1F2440] whitespace-nowrap">
                      {formatBDT(fee.amount)}
                    </p>

                    <motion.div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${style.bg}`}
                      whileHover={{ scale: 1.08 }}
                      animate={status === "overdue" ? { scale: [1, 1.05, 1] } : {}}
                      transition={status === "overdue" ? { duration: 1.5, repeat: Infinity } : {}}
                    >
                      <StatusIcon className={`w-4 h-4 ${style.text}`} />
                      <span className={`text-xs font-semibold capitalize ${style.text}`}>
                        {status === "paid" ? "Paid ✓" : status === "overdue" ? "Overdue !" : "Unpaid"}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
