import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, X, Flag, Trophy, BookOpen, PartyPopper, Users, GraduationCap, CalendarDays, Sparkles } from "lucide-react";
import { useAuth } from "../Auth/AuthContext.jsx";
import Nav from "../Home/Nav.jsx";
import API from "../Server/api";

const eventTypeConfig = {
  exam: { color: "#A6402F", label: "Exam", icon: BookOpen },
  holiday: { color: "#9C8054", label: "Holiday", icon: PartyPopper },
  event: { color: "#5B5A8C", label: "Event", icon: Trophy },
  admission: { color: "#4B7A5A", label: "Admission", icon: GraduationCap },
  meeting: { color: "#1F2440", label: "Meeting", icon: Users },
  sports: { color: "#C17A3D", label: "Sports", icon: Flag },
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatDateShort(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function CalendarPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/calendar", { params: { limit: 200 } })
      .then((res) => setEvents(res.data.data || res.data || []))
      .catch(() => setEvents([]));
  }, []);

  const student = user?.student || null;
  const handleLogout = async () => { await logout(); navigate("/login"); };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(today.toISOString().split("T")[0]);
  };

  const eventsForDate = (dateStr) => {
    return events.filter((e) => {
      if (!e.start_date) return false;
      if (e.end_date) {
        return dateStr >= e.start_date && dateStr <= e.end_date;
      }
      return e.start_date === dateStr;
    });
  };

  const selectedDateEvents = selectedDate ? eventsForDate(selectedDate) : [];
  const todayStr = today.toISOString().split("T")[0];

  const upcomingEvents = events
    .filter((e) => e.start_date >= todayStr)
    .sort((a, b) => a.start_date.localeCompare(b.start_date))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav student={student} onLogout={handleLogout} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-[#1F2440] p-7 md:p-9 border-b-[3px] border-b-[#9C8054] mb-10"
        >
          {/* Floating calendar icon */}
          <motion.div
            className="absolute -right-4 -top-6 text-white/[0.06]"
            animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-44 h-44">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </motion.div>
          <motion.div
            className="absolute bottom-2 left-10 text-white/[0.04]"
            animate={{ y: [0, 8, 0], rotate: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Sparkles className="w-20 h-20" />
          </motion.div>

          <div className="relative z-10 max-w-2xl">
            <motion.p
              className="text-[#B79B6B] text-xs font-semibold tracking-[0.2em] uppercase mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Academic Calendar
            </motion.p>
            <motion.h1
              className="font-serif-display text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Events & <span className="italic text-[#B79B6B]">Important Dates</span>
            </motion.h1>
            <motion.p
              className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Never miss an important event. View exams, holidays, meetings, and school activities at a glance.
            </motion.p>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-between mb-8"
        >
          <div />
          <motion.button
            onClick={goToToday}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1F2440] text-white hover:bg-[#2C3359] transition-colors shadow-md hover:shadow-lg"
          >
            Today
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-xl border border-[#E7E4DB] p-6"
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-8">
              <motion.button
                onClick={prevMonth}
                whileHover={{ x: -4, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </motion.button>
              <motion.h2
                className="text-xl font-bold text-[#1F2440] font-serif-display"
                key={`${currentMonth}-${currentYear}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {MONTHS[currentMonth]} {currentYear}
              </motion.h2>
              <motion.button
                onClick={nextMonth}
                whileHover={{ x: 4, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </motion.button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2 tracking-wide">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-xl overflow-hidden">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-white aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayEvents = eventsForDate(dateStr);
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;
                const hasEvents = dayEvents.length > 0;

                const startingEvents = events.filter((e) => e.start_date === dateStr);
                const endingEvents = events.filter((e) => e.end_date && e.end_date === dateStr && e.end_date !== e.start_date);
                const showIcon = startingEvents.length > 0 || endingEvents.length > 0;
                const primaryEvent = startingEvents[0] || endingEvents[0] || dayEvents[0];
                const primaryCfg = primaryEvent ? (eventTypeConfig[primaryEvent.event_type] || eventTypeConfig.event) : null;
                const primaryColor = primaryCfg ? primaryCfg.color : null;
                const EventIcon = primaryCfg ? primaryCfg.icon : null;
                const isStart = startingEvents.length > 0;

                return (
                  <motion.button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    whileHover={{ scale: 1.08, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative bg-white aspect-square flex flex-col items-center justify-center text-sm transition-all duration-150 ${
                      isSelected
                        ? "bg-[#1F2440] text-white font-semibold"
                        : isToday
                        ? "bg-[#1F2440]/5 font-semibold text-[#1F2440]"
                        : hasEvents
                        ? "font-medium text-gray-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    style={
                      hasEvents && !isSelected
                        ? { backgroundColor: primaryColor + "12" }
                        : undefined
                    }
                  >
                    {day}

                    {/* Event icon on start/end dates */}
                    {showIcon && EventIcon && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                        className="absolute top-0.5 right-0.5"
                      >
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: isSelected ? "rgba(255,255,255,0.2)" : primaryColor + "20" }}
                        >
                          <EventIcon
                            className="w-2.5 h-2.5"
                            style={{ color: isSelected ? "white" : primaryColor }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Small dots for multi-event days */}
                    {hasEvents && (
                      <div className="flex gap-0.5 mt-0.5">
                        {dayEvents.slice(0, 3).map((e, j) => {
                          const cfg = eventTypeConfig[e.event_type] || eventTypeConfig.event;
                          return (
                            <div
                              key={j}
                              className="w-1 h-1 rounded-full"
                              style={{ backgroundColor: isSelected ? "white" : cfg.color }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Selected date events */}
            {selectedDate && (
              <div className="bg-white rounded-xl border border-[#E7E4DB] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#1F2440] font-serif-display">
                    {formatDate(selectedDate)}
                  </h3>
                  <button onClick={() => setSelectedDate(null)} className="p-1 rounded-lg hover:bg-gray-100">
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => {
                      const cfg = eventTypeConfig[event.event_type] || eventTypeConfig.event;
                      return (
                        <div
                          key={event.event_id}
                          onClick={() => setSelectedEvent(event)}
                          className="p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border-l-[3px]"
                          style={{ borderLeftColor: cfg.color }}
                        >
                          <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: cfg.color }}>
                            {cfg.label}
                          </span>
                          <p className="text-sm font-semibold text-[#1F2440] mt-1">{event.title}</p>
                          {event.end_date && event.end_date !== event.start_date && (
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDateShort(event.start_date)} — {formatDateShort(event.end_date)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No events on this date</p>
                )}
              </div>
            )}

            {/* Upcoming events */}
            <div className="bg-white rounded-xl border border-[#E7E4DB] p-5">
              <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">
                Upcoming
              </h3>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => {
                  const cfg = eventTypeConfig[event.event_type] || eventTypeConfig.event;
                  return (
                    <motion.div
                      key={event.event_id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.02)" }}
                      onClick={() => setSelectedEvent(event)}
                      className="flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors"
                    >
                      <motion.div
                        className="w-1 h-1 rounded-full mt-2 shrink-0"
                        style={{ backgroundColor: cfg.color }}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{event.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDateShort(event.start_date)}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Event type legend */}
            <div className="bg-white rounded-xl border border-[#E7E4DB] p-5">
              <h3 className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">
                Event Types
              </h3>
              <div className="space-y-2.5">
                {Object.entries(eventTypeConfig).map(([key, cfg], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2.5 text-xs"
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cfg.color }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    />
                    <span className="text-gray-500">{cfg.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* All Events List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-[#1F2440]/[0.06]">
              <CalendarDays className="w-5 h-5 text-[#1F2440]" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="font-serif-display text-xl font-semibold text-[#1F2440]">All Events</h2>
              <p className="text-xs text-gray-400">Complete list of school events and important dates</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event, index) => {
              const cfg = eventTypeConfig[event.event_type] || eventTypeConfig.event;
              const EventIcon = cfg.icon;
              const isPast = event.start_date < todayStr;
              return (
                <motion.div
                  key={event.event_id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  onClick={() => setSelectedEvent(event)}
                  className={`bg-white rounded-xl border border-[#E7E4DB] p-5 cursor-pointer transition-all hover:shadow-[0_6px_20px_rgba(31,36,64,0.08)] ${isPast ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.4 }}
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cfg.color + "15" }}
                    >
                      <EventIcon className="w-5 h-5" style={{ color: cfg.color }} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.color + "15", color: cfg.color }}>
                          {cfg.label}
                        </span>
                        {isPast && (
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Past</span>
                        )}
                      </div>
                      <h3 className="font-serif-display text-base font-semibold text-[#1F2440] leading-snug mb-1.5">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">
                          {event.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatDateShort(event.start_date)}</span>
                        {event.end_date && event.end_date !== event.start_date && (
                          <span> — {formatDateShort(event.end_date)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {events.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-[#E7E4DB]">
              <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No events yet</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Event detail modal */}
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden border border-[#E7E4DB]"
          >
            {(() => {
              const cfg = eventTypeConfig[selectedEvent.event_type] || eventTypeConfig.event;
              return (
                <>
                  <div className="h-[3px]" style={{ backgroundColor: cfg.color }} />
                  <div className="p-6 pb-0">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: cfg.color }}>
                        {cfg.label}
                      </span>
                      <button onClick={() => setSelectedEvent(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
                        <X className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                    <h2 className="text-xl font-bold text-[#1F2440] mb-3 leading-snug font-serif-display">
                      {selectedEvent.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-5">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(selectedEvent.start_date)}</span>
                      {selectedEvent.end_date && selectedEvent.end_date !== selectedEvent.start_date && (
                        <span> — {formatDate(selectedEvent.end_date)}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed pb-6">
                      {selectedEvent.description || "No description available."}
                    </p>
                  </div>
                </>
              );
            })()}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
