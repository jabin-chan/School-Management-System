import API from "./api";

const admissionService = {
  apply: (formData) =>
    API.post("/admission/apply", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  list: (params = {}) => API.get("/admin/admissions", { params }),

  get: (id) => API.get(`/admin/admissions/${id}`),

  updateStatus: (id, status) =>
    API.patch(`/admin/admissions/${id}/status`, { status }),
};

export default admissionService;
