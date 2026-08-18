import API from "./api";

const authService = {
  adminLogin: (admin_id, password) =>
    API.post("/auth/admin/login", { admin_id, password }),

  studentLogin: (student_id, password) =>
    API.post("/auth/student/login", { student_id, password }),

  logout: () => API.post("/auth/logout"),

  me: () => API.get("/auth/me"),
};

export default authService;
