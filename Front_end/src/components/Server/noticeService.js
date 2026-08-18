import API from "./api";

const noticeService = {
  listPublic: (params = {}) => API.get("/notices", { params }),

  getPublic: (id) => API.get(`/notices/${id}`),

  listAdmin: (params = {}) => API.get("/admin/notices", { params }),

  getAdmin: (id) => API.get(`/admin/notices/${id}`),

  create: (formData) =>
    API.post("/admin/notices", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id, formData) =>
    API.patch(`/admin/notices/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  remove: (id) => API.delete(`/admin/notices/${id}`),
};

export default noticeService;
