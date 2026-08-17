import API from "./api";

const studentService = {
  me: () => API.get("/students/me"),

  updateMe: (formData) =>
    API.patch("/students/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  myFees: () => API.get("/students/me/fees"),

  myResults: (params = {}) => API.get("/students/me/results", { params }),

  changePassword: (currentPassword, newPassword) =>
    API.post("/students/me/change-password", { currentPassword, newPassword }),

  list: (params = {}) => API.get("/admin/students", { params }),

  get: (id) => API.get(`/admin/students/${id}`),

  create: (formData) =>
    API.post("/admin/students", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id, formData) =>
    API.patch(`/admin/students/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  setStatus: (id, status) =>
    API.patch(`/admin/students/${id}/status`, { status }),

  remove: (id) => API.delete(`/admin/students/${id}`),
};

export default studentService;
