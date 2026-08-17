import API from "./api";

const resultService = {
  list: (params = {}) => API.get("/admin/results", { params }),

  get: (id) => API.get(`/admin/results/${id}`),

  createOrUpdate: (data) => API.post("/admin/results", data),

  remove: (id) => API.delete(`/admin/results/${id}`),

  addDetail: (data) => API.post("/admin/results/details", data),

  removeDetail: (id) => API.delete(`/admin/results/details/${id}`),
};

export default resultService;
