import API from "./api";

const postService = {
  listPublic: (params = {}) => API.get("/posts", { params }),

  create: (content) => API.post("/posts", { content }),

  upvote: (id) => API.post(`/posts/${id}/upvote`),

  downvote: (id) => API.post(`/posts/${id}/downvote`),

  getComments: (postId) => API.get(`/posts/${postId}/comments`),

  addComment: (postId, comment) =>
    API.post(`/posts/${postId}/comments`, { comment }),

  listAdmin: (params = {}) => API.get("/admin/posts", { params }),

  getCommentsAdmin: (postId) => API.get(`/admin/posts/${postId}/comments`),

  deletePost: (id) => API.delete(`/admin/posts/${id}`),

  deleteComment: (id) => API.delete(`/admin/comments/${id}`),
};

export default postService;
