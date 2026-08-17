import API from "./api";

const adminService = {
  login: (admin_id, password) =>
    API.post("/auth/admin/login", { admin_id, password }),

  logout: () => API.post("/auth/logout"),

  health: () => API.get("/admin/health"),

  // Admissions
  getAdmissions: (params = {}) => API.get("/admin/admissions", { params }),
  getAdmission: (id) => API.get(`/admin/admissions/${id}`),
  updateAdmissionStatus: (id, status, credentials = {}) =>
    API.patch(`/admin/admissions/${id}/status`, { status, ...credentials }),

  // Students
  getStudents: (params = {}) => API.get("/admin/students", { params }),
  getStudent: (id) => API.get(`/admin/students/${id}`),
  createStudent: (formData) =>
    API.post("/admin/students", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateStudent: (id, formData) =>
    API.patch(`/admin/students/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteStudent: (id) => API.delete(`/admin/students/${id}`),
  setStudentStatus: (id, status) =>
    API.patch(`/admin/students/${id}/status`, { status }),

  // Teachers
  getTeachers: (params = {}) => API.get("/admin/teachers", { params }),
  getTeacher: (id) => API.get(`/admin/teachers/${id}`),
  createTeacher: (formData) =>
    API.post("/admin/teachers", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateTeacher: (id, formData) =>
    API.patch(`/admin/teachers/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteTeacher: (id) => API.delete(`/admin/teachers/${id}`),

  // Notices
  getNotices: (params = {}) => API.get("/admin/notices", { params }),
  getNotice: (id) => API.get(`/admin/notices/${id}`),
  createNotice: (formData) =>
    API.post("/admin/notices", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateNotice: (id, formData) =>
    API.patch(`/admin/notices/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteNotice: (id) => API.delete(`/admin/notices/${id}`),

  // Posts (Anonymous)
  getPosts: (params = {}) => API.get("/admin/posts", { params }),
  deletePost: (id) => API.delete(`/admin/posts/${id}`),
  getPostComments: (id) => API.get(`/admin/posts/${id}/comments`),
  deleteComment: (id) => API.delete(`/admin/comments/${id}`),

  // Calendar
  getCalendarEvents: (params = {}) => API.get("/admin/calendar", { params }),
  createCalendarEvent: (data) => API.post("/admin/calendar", data),
  updateCalendarEvent: (id, data) => API.patch(`/admin/calendar/${id}`, data),
  deleteCalendarEvent: (id) => API.delete(`/admin/calendar/${id}`),

  // Fees
  getFees: () => API.get("/admin/fees"),
  createFee: (data) => API.post("/admin/fees", data),
  updateFee: (id, data) => API.patch(`/admin/fees/${id}`, data),
  deleteFee: (id) => API.delete(`/admin/fees/${id}`),
  getFeeStudents: (id, params = {}) => API.get(`/admin/fees/${id}/students`, { params }),
  markStudentPaid: (feeId, studentId) => API.patch(`/admin/fees/${feeId}/students/${studentId}/pay`),
};

export default adminService;
