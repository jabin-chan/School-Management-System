import { motion } from "framer-motion";
import { BookOpen, CreditCard, Bell, Flame } from "lucide-react";

const stats = [
  { label: "Active Courses", value: "6", icon: BookOpen },
  { label: "Pending Fees", value: "2", icon: CreditCard },
  { label: "New Notices", value: "5", icon: Bell },
  { label: "Study Streak", value: "12 days", icon: Flame },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function StatsRow() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ y: -3 }}
            className="bg-white rounded-xl p-4 md:p-5 border border-[#E7E4DB] cursor-pointer transition-shadow hover:shadow-[0_4px_16px_rgba(31,36,64,0.06)]"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#1F2440]/[0.06]">
                <Icon className="w-4.5 h-4.5 text-[#1F2440]" strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-serif-display text-xl md:text-2xl font-semibold text-[#1F2440]">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
