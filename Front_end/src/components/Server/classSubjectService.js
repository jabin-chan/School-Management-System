import API from "./api";

const classSubjectService = {
  list: (params = {}) => API.get("/class-subjects", { params }),

  get: (id) => API.get(`/class-subjects/${id}`),

  create: (data) => API.post("/admin/class-subjects", data),

  remove: (id) => API.delete(`/admin/class-subjects/${id}`),
};

export default classSubjectService;
