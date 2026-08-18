import { motion } from "framer-motion";
import { Mail, Phone, BookOpen, Award, Calendar, Sparkles } from "lucide-react";

export default function TeacherCard({ teacher, onClick, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.08, type: "spring", stiffness: 200 }}
      whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 15 } }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(teacher)}
      className="group relative bg-white rounded-xl border border-[#E7E4DB] overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-[0_12px_32px_rgba(31,36,64,0.12)]"
    >
      {/* Image section */}
      <div className="relative h-[200px] overflow-hidden">
        {teacher.photo_url ? (
          <img
            src={`http://localhost:5000${teacher.photo_url}`}
            alt={teacher.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1F2440] to-[#2C3359] flex items-center justify-center transition-all duration-500 group-hover:scale-110">
            <motion.span
              className="text-6xl font-bold text-white/80 font-serif-display"
              whileHover={{ rotate: [0, -5, 5, 0] }}
            >
              {teacher.name?.charAt(0)}
            </motion.span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Sparkle effect on hover */}
        <motion.div
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-5 h-5 text-[#9C8054]" />
        </motion.div>

        {/* Hover overlay with contact info */}
        <div className="absolute inset-0 bg-[#1F2440]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-4">
          <div className="flex flex-col items-center gap-3">
            {teacher.email && (
              <motion.a
                href={`mailto:${teacher.email}`}
                onClick={(e) => e.stopPropagation()}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                className="flex items-center gap-2 text-white text-sm hover:text-[#9C8054] translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="truncate max-w-[180px]">{teacher.email}</span>
              </motion.a>
            )}
            {teacher.phone_number && (
              <motion.a
                href={`tel:${teacher.phone_number}`}
                onClick={(e) => e.stopPropagation()}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                className="flex items-center gap-2 text-white text-sm hover:text-[#9C8054] translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span>{teacher.phone_number}</span>
              </motion.a>
            )}
            {teacher.qualification && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                className="flex items-center gap-2 text-white text-sm translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <span className="truncate max-w-[180px]">{teacher.qualification}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Subject badge */}
        {teacher.subject && (
          <motion.div
            className="absolute top-3 left-3"
            whileHover={{ scale: 1.1, rotate: -3 }}
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md">
              <BookOpen className="w-3.5 h-3.5 text-[#1F2440]" />
              <span className="text-xs font-semibold text-[#1F2440]">{teacher.subject}</span>
            </div>
          </motion.div>
        )}

        {/* Active status */}
        <div className="absolute top-3 right-3">
          <motion.div
            className={`w-3 h-3 rounded-full border-2 border-white ${teacher.is_active ? "bg-[#4B7A5A]" : "bg-gray-400"}`}
            animate={teacher.is_active ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Info section */}
      <div className="p-4">
        <h3 className="text-base font-bold text-[#1F2440] truncate font-serif-display group-hover:text-[#9C8054] transition-colors duration-300">
          {teacher.name}
        </h3>
        <p className="text-sm text-[#9C8054] font-medium truncate mt-0.5">
          {teacher.designation || "Teacher"}
        </p>

        {/* Quick info row */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
          {teacher.joining_date && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>{teacher.joining_date}</span>
            </div>
          )}
          {teacher.bio && (
            <p className="text-xs text-gray-400 truncate flex-1">
              {teacher.bio}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
