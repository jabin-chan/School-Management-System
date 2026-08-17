import API from "./api";

const teacherService = {
  listPublic: (params = {}) => API.get("/teachers", { params }),

  getPublic: (id) => API.get(`/teachers/${id}`),

  list: (params = {}) => API.get("/admin/teachers", { params }),

  get: (id) => API.get(`/admin/teachers/${id}`),

  create: (formData) =>
    API.post("/admin/teachers", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id, formData) =>
    API.patch(`/admin/teachers/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  remove: (id) => API.delete(`/admin/teachers/${id}`),
};

export default teacherService;
